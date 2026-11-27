---
title: Moving a service off Heroku when the database clock started ticking
summary: I was assigned to migrate a customer-facing Java service from Heroku to GCP and upgrade its Java BOM. A Heroku notice about an impending database auto-upgrade changed the order of work. I led the database migration to GCP CloudSQL first, then finished the upgrade, cutting infrastructure cost by 70%.
themes: [reliability, platform, integrity]
weight: 5
context: Customer-facing Java service (Thryv/Keap)
stack: [Java, Micronaut, PostgreSQL, GCP CloudSQL, Heroku, Terraform, CircleCI]
short: Heroku Postgres to GCP CloudSQL
hook: Re-planned a migration around a forced database upgrade, moved the data with its integrity intact, and cut infrastructure cost by 70%.
stats:
  - { value: "70%", label: "lower infrastructure cost" }
  - { value: "3", label: "environments migrated: integration, staging, production" }
  - { value: "0", label: "Heroku footprint left after decommission" }
tldr:
  - "**Problem:** an outdated service on Heroku, and a Heroku notice that the database would be auto-upgraded."
  - "**Decision:** migrate the data first, with a simple, low-risk plan, then return to the dependency upgrade."
  - "**Result:** 70% lower cost, better security, and the service under SRE-managed support."
---

## Problem

I was assigned to move a customer-facing Java service from Heroku to GCP and to update its Java BOM, which was out of date. My first assessment showed the service did not follow standard practices and was not production-ready as a microservice.

I started with the BOM upgrade. Then Heroku sent a notice about an **impending automatic upgrade of the database**, and the priority changed: data integrity and service continuity came first.

## Constraints

- The database move could not wait for the dependency upgrade to finish.
- No data could be lost, and the service had to keep running.
- The service did not follow standard practices.

## Approach

- **Aligned first.** I talked to the team, the original developers and the platform team to understand requirements, constraints and priorities.
- **Planned in pieces.** I broke the work into epics, asked for end-to-end tests to protect existing behavior, and used frontend feature flags to control the cutover in each environment.
- **Kept the data move simple.** I designed a migration approach that was simple, reliable and cheap to run, with clear execution steps.
- **Fixed what the migration exposed.** The schema had circular references. I preserved the data and corrected the schema in GCP.
- **Made deployments repeatable.** I updated Terraform and CircleCI so every environment deployed the same way and post-migration fixes could ship everywhere. That covered all three environments: integration, staging and production.
- **Cleaned up the edges.** I removed legacy Heroku server URLs, fixed cross-origin handling for the frontend, pointed identity-provider URLs at the right staging and production endpoints, and decommissioned Heroku.

## Then the upgrade

With the data safe, I went back to the BOM upgrade and its knock-on changes:

- SDK upgrades that needed code changes.
- Custom enums migrated to `varchar` for compatibility.
- A shaded package for a dependency combination that could not be upgraded directly.

## Outcome

- **70% lower infrastructure cost.**
- Better security, and the service now runs under **SRE-managed support**.
- Continuity and data integrity kept by reordering the work around the real risk.
- Foundational issues fixed along the way, which made later improvements easier.
