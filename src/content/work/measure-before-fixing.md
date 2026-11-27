---
title: Measure before you migrate
summary: Resources exported into Solution Launchpad were left broken by an earlier, already-fixed bug, and a full migration was on the table. I proposed quantifying the damage first, built an admin endpoint that scanned for broken resources and counted them by failure state, and the data showed the full migration wasn't needed.
themes: [reliability, integrity, platform]
weight: 4
context: Packaging Service, Solution Launchpad (Thryv/Keap)
stack: [Java, Micronaut, PostgreSQL]
short: Measure before you migrate
hook: A full migration looked necessary. One admin endpoint that counted the damage showed it wasn't.
tldr:
  - "**Problem:** Email Templates and Landing Pages left broken by an old bug, needing manual fixes, and pressure to run a full migration."
  - "**Decision:** quantify first. An admin endpoint scanned applications and counted broken resources by failure state."
  - "**Result:** the team decided from data, and an unnecessary migration was avoided."
---

## Problem

In the Template Management Service, some resources exported into Solution Launchpad stayed broken because of a bug that had already been fixed. Customers using **Email Templates** and **Landing Pages** were affected, and each broken resource needed manual intervention.

The open question was scope: how many resources were broken, across which systems, and did that justify a full migration?

## Approach

- **Took ownership and brought the right people in.** I started discussions with the PM, the Landing Page team and the Email Template team to understand scope and impact across domains.
- **Proposed measuring before fixing.** A full migration would have been a significant effort, so I proposed quantifying the problem first.
- **Built the measurement into the service.** I implemented an admin endpoint in the Packaging Service that scans applications for broken resources and returns counts across the different failure states.
- **Kept the results for analysis.** The endpoint persists its results in a temporary table, so the team could trace and diagnose the issue across the service's domain and see how failures were distributed.

## Outcome

- Stakeholders made the call **from service-generated data**, not estimates.
- The data showed a **full migration wasn't needed**, avoiding the engineering effort.
- A structured, repeatable way to find, trace and diagnose broken resources the service owns.
- Every team involved worked from the same numbers.
