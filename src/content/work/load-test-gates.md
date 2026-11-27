---
title: Latency and error budgets as CI gates
summary: I stood up a K6 load-test harness with WireMock-backed mocks for external services, then wrote suites for every major endpoint group, so CI fails when error rate reaches 1% or p95 latency reaches 500ms.
themes: [reliability, platform]
weight: 4
context: Solution Launchpad (Thryv/Keap)
stack: [K6, WireMock, CI]
short: Latency and error budgets in CI
hook: Every major endpoint group now has to stay under 1% errors and 500ms p95 before code ships.
stats:
  - { value: "14", label: "endpoint groups covered" }
  - { value: "<1%", label: "error-rate gate" }
  - { value: "<500ms", label: "p95 latency gate" }
tldr:
  - "**Foundation:** a reusable K6 harness with scenarios, thresholds and WireMock mocks for external services."
  - "**Coverage:** suites for every major endpoint group, from tenants and permissions to installs and batch requests."
  - "**Gate:** CI enforces error rate under 1% and p95 under 500ms on each group."
---

## Problem

There was no shared harness for measuring **endpoint latency and error rates** under load.

## What I built

- **A harness first.** I set up the K6 load-test foundation: scenarios, thresholds, and **WireMock-backed mocks** for external services.
- **Then coverage.** I wrote suites for every major endpoint group, **14 in all**: tenants, consent, shared and shareable resources, links, public preview, categories, bundles, export requests, permissions, tracked resources, tenant-scoped tracked resources, installs, batch requests, and packaging requests.
- **Then the gate.** Each group runs in CI against explicit thresholds: **error rate under 1% and p95 latency under 500ms**.

## Outcome

- Every endpoint group has a latency and error-rate gate in CI.
- A reusable framework for measuring endpoint latency and error rates in CI.
