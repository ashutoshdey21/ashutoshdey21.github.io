---
title: Cross-cloud auth with no static keys, and the bug that would have looped every message
summary: A GKE service needed to consume AWS SQS billing events without any AWS credentials on the pod. I built a Workload Identity to AWS STS federation chain and found, before launch, a silent framework bug that would have sent every successfully processed message to the dead-letter queue.
themes: [integration, reliability]
weight: 5
context: Customer-facing Java service (Thryv/Keap)
stack: [Java 21, Micronaut, AWS SQS, AWS SNS, AWS STS, GCP Workload Identity, JUnit 5, Mockito]
short: Cross-cloud auth with zero static keys
status: Design write-up · not yet live
hook: Connected a GKE service to AWS SQS with no stored credentials, and caught a silent bug that would have sent every processed message to the dead-letter queue.
stats:
  - { value: "0", label: "static AWS keys" }
  - { value: "15", label: "commits, sole author" }
  - { value: "~850", label: "lines of tests across 6 classes" }
tldr:
  - "**Auth:** GKE Workload Identity to a Google ID token to AWS STS, with a fresh token on every credential refresh."
  - "**Correctness:** per-message acknowledgement instead of the library's batch default; explicit retryable vs. permanent failures."
  - "**Pre-launch catch:** a missing bean registration silently skipped acknowledgements."
---

**Status: not live in production.** The consumer is built and unit-tested but not yet enabled in any environment, so there are no production metrics. This is a design write-up.

## Problem

A customer-facing Java service, running on Google Kubernetes Engine, needed to react to subscription billing events from a third-party billing provider. Those events arrive through AWS SNS into an AWS SQS queue. The goal was to react to subscription lifecycle events without polling or coupling to the legacy billing system.

I was the **sole author: all 15 commits**. The AWS-side infrastructure (queue, dead-letter queue, IAM role, SNS topic, CloudWatch alarm) is owned and provisioned separately; this service consumes it through config.

## Constraints

- **No static AWS keys on the pod.** The service lives in GCP and has to authenticate to AWS anyway.
- **No silent data loss.** A failed message must not disappear; a succeeded message must not come back.
- **Less code to own.** The first version used a hand-rolled polling loop.

## Architecture

```
Billing provider -> enrichment -> AWS SNS -> AWS SQS
          (visibility timeout 300s, max receive count 5)
   |  GKE Workload Identity -> Google ID token
   |  -> AWS STS AssumeRoleWithWebIdentity -> temporary AWS credentials
   v
Our service (GKE)
  listener (UNORDERED_ACKNOWLEDGE, prefetch 0)
    -> transformer (wire DTO -> domain model) -> service
  success   -> success handler deletes that one message
  retryable -> no ack -> SQS redelivers -> after 5 tries (~25 min) -> DLQ -> CloudWatch alarm
  permanent -> ack -> discarded immediately
```

## Decisions

- **Federated identity instead of keys.** I built a token provider that mints a Google ID token for the `sts.amazonaws.com` audience. The existing internal token provider hardcoded a different audience, so it could not be reused. A supplier feeds it into the STS web-identity credentials provider, so **a fresh token is minted on every credential refresh**. Result: a zero-static-key OIDC chain from GKE to SQS, a pattern the service did not have before.
- **Managed listener instead of a custom poller.** I replaced the hand-rolled polling loop with `micronaut-jms-sqs`'s listener. That removed a custom poller and its executor lifecycle, trading fine-grained polling control for less code to own.
- **Acknowledge one message, not the batch.** The library default, `CLIENT_ACKNOWLEDGE`, acknowledges the whole prefetched batch rather than the one message that succeeded, which can silently delete unrelated failed messages. I chose `UNORDERED_ACKNOWLEDGE` with a custom success handler.
- **Retryable vs. permanent as a domain decision.** Instead of retrying everything, failures are explicitly classified, following an existing pattern from another service. SQS's own receive count (5) is the only authority on redelivery; the app does not track attempts.
- **Fail loudly on bad input.** Strict typed DTOs rely on raw message delivery on the SNS subscription instead of parsing an SNS envelope in code, so malformed input goes to the discard path instead of deserializing into blank fields.

## The bug found before launch

Micronaut only auto-registers an acknowledging handler for `CLIENT_ACKNOWLEDGE`. Under `UNORDERED_ACKNOWLEDGE` it **silently skipped my success handler** because it was not a bean. Nothing errored. In production, **every successfully processed message would have gone unacknowledged, been redelivered, and ended up in the dead-letter queue.** The fix was one annotation: making the handler an explicit `@Singleton`.

A second gap: the original handler deleted every failure immediately, whatever the cause. The dead-letter queue and its CloudWatch alarm were provisioned but **could never fire**. The retryable/permanent split made that path reachable, and it is unit-tested.

## Outcome

- A complete, tested consumer with **zero static credentials**.
- A bug that would have looped every message into the DLQ, **caught before launch**.
- **6 test classes, about 850 lines**, covering the listener, transformer, error handler and success handler, including retry-vs-discard decisions made through wrapped exception causes.
- An operations runbook.
