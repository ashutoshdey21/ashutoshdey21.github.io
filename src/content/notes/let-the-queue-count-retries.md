---
title: Let the queue count the retries
summary: When an SQS consumer fails, decide in code whether the failure is retryable or permanent, and let the queue's own receive count decide how many times to try.
themes: [integration, reliability]
weight: 4
related: /work/cross-cloud-sqs-consumer/
---

The tempting design is to retry everything and track attempts in application code. I did neither.

**Classify, don't count.** Each failure is an explicit domain decision: retryable or permanent. A retryable failure is not acknowledged, so SQS redelivers it. A permanent failure is acknowledged and discarded immediately, because retrying it would only produce the same error.

**One authority on redelivery.** The queue's maximum receive count (5 here) is the only thing that decides when a message has had enough tries. After that it moves to the dead-letter queue and a CloudWatch alarm fires. The application never tracks attempts, so there is no second counter to drift out of sync with the first.

**Make the dead-letter path reachable.** The handler I replaced deleted every failure immediately. The dead-letter queue and its alarm were provisioned but could never fire. Infrastructure that exists is not the same as infrastructure that works.
