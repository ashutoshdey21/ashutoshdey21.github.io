---
title: Per-tenant serialization with Postgres advisory locks
summary: Parallel tasks for the same tenant risked row-level conflicts and data corruption in export and install workflows. I compared three locking approaches and chose transaction-scoped Postgres advisory locks, which cut install/export failures by 35% without changing the existing flows.
themes: [platform, integrity, reliability]
weight: 5
context: Packaging Service, Solution Launchpad (Thryv/Keap)
stack: [Java, Micronaut, PostgreSQL]
---

## Problem

In the Packaging Service behind Solution Launchpad, multiple tasks for the same tenant could run in parallel. During export and install workflows that meant row-level conflicts and a real risk of data corruption.

## Constraints

- Work for one tenant had to run one task at a time.
- Performance had to hold.
- The existing install and export flows could not be rewritten to fit the fix.

## Options considered

I evaluated **three** distributed locking strategies:

1. **Postgres advisory locks**
2. **Database locks**
3. **Redis-based locks**

## Decision

I chose **transaction-scoped Postgres advisory locks** to serialize work per tenant, for three reasons:

- They **avoided changes to the existing install and export flows**.
- They **used infrastructure the service already had**, so there was nothing new to run.
- Compared with Redis, they were **simpler and kept transactional guarantees** with the data being protected.

After implementing it, I checked thread availability and adjusted infrastructure so the service could support the locking under concurrent load.

## Proving it works

Concurrency bugs rarely show up in ordinary tests. I designed **integration tests using Java concurrency utilities** that put multiple tasks on the same tenant at the same moment, simulating real-world contention, and validated the locking behavior.

## Outcome

- **35% fewer install/export failures.**
- **Eliminated concurrent modifications for a tenant**, removing the race conditions in export and install workflows.
- Changed **none** of the existing install and export flows, with no regressions.
- Left a **reusable concurrency-control pattern** that other workflows in the service can apply.
