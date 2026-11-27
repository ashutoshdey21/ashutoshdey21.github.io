---
title: One authorization surface instead of a check in every controller
summary: Permissions in a content marketplace backend were scattered, flag-gated and checked separately in each controller. I built the permission endpoints, replaced the per-controller tenant checks with one shared write-access check, centralized identity reads, and kept role changes in sync through Pub/Sub, fixing a listener misconfiguration that would have locked users out.
themes: [platform, integrity, integration]
weight: 5
context: Content marketplace platform (Thryv/Keap)
stack: [Java, Micronaut, PostgreSQL, GCP Pub/Sub, Terraform]
short: One authorization surface
hook: Replaced tenant checks scattered across controllers with one shared check, and caught a defect that would have locked users with certain roles out.
stats:
  - { value: "1", label: "shared write-access check, replacing per-controller tenant checks" }
  - { value: "3", label: "permission endpoints: get, grant, revoke" }
  - { value: "1", label: "helper for all identity reads" }
tldr:
  - "**Consolidated:** get, grant and revoke endpoints, admin listing, post-commit cache invalidation, and one shared write-access check."
  - "**Kept in sync:** account role and permission changes arrive through Pub/Sub, so permissions follow account state without manual steps."
  - "**Caught early:** a misconfigured listener that would have blocked users with specific roles from the marketplace."
---

## Problem

Authorization had grown piece by piece. Permissions were **scattered and gated behind a legacy feature flag**, and individual controllers ran their own tenant checks, which left gaps wherever a controller rolled its own.

## What I built

- **A real permission model.** Get, grant and revoke endpoints for user permissions, an admin listing, and **post-commit cache invalidation**, so the cache is cleared after the permission change commits.
- **One write-access check.** I replaced the ad-hoc per-controller tenant checks with a single shared check and removed the legacy gating flag, eliminating duplicated logic and the gaps between controllers.
- **One source of truth for identity.** All identity reads go through one shared security helper, which also added support for a newer identity-provider email-claim format. Future auth-format changes touch one helper instead of every controller.
- **Support paths with boundaries.** An internal support-user bypass, ownership-lookup endpoints for marketplace and packaging resources, support variants of key endpoints, and an authorization path for exporting consent records. Support reps can now self-serve diagnostic and export queries without engineering escalation.

## Keeping permissions in sync

The marketplace needed to react to account role and permission changes in near real time.

- **Subscription.** I studied how other projects subscribed to topics, followed the engineering handbook, and wired up a Pub/Sub subscription to the existing permission-update topic. It didn't work at first: the source topic lacked permissions for our project to subscribe. I got the owning team to grant access, then **updated the handbook** with the missing step.
- **Infrastructure timing.** The Terraform plan showed changes I hadn't made: the SRE team was migrating databases across regions. I held my merge until their migration finished, helped test our service's database changes in integration, and kept application work moving on a separate ticket. Along the way I found a **hardcoded region** in the Cloud SQL setup and replaced it with a variable.
- **The defect.** After removing the feature flag around permissions for a marketplace role, I validated scenarios in the integration environment and saw role and permission changes behaving against business requirements. I confirmed expected behavior with the PM, traced the root cause to an **incorrect listener configuration** for events from the account system, corrected and simplified it, and added logging for failure cases. I validated the fix in isolation with a test listener subscription, monitoring events to confirm correct handling.

## Outcome

- A scattered, flag-gated permission model became **one consistent authorization surface**.
- Prevented a critical customer-facing defect that would have **blocked users with specific roles** from marketplace features.
- Permissions stay in sync with account changes automatically.
- Support reps self-serve diagnostic queries instead of escalating to engineering.
