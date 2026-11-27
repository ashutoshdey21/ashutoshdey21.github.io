---
title: Async installs, notifications, and settings that don't erase each other
summary: Installing large content bundles in a marketplace could take several minutes while users waited on screen. I made installs notify users by email and in-app when they finish, built the Tenant Settings entity, API and cache layer from scratch, and fixed a partial-update bug that silently dropped unrelated settings.
themes: [platform, integration]
weight: 3
context: Content marketplace platform (Thryv/Keap)
stack: [Java, Micronaut, PostgreSQL]
short: Async installs and per-tenant settings
hook: Users no longer wait on screen for long installs, and tenants can opt out of notifications without losing other settings.
stats:
  - { value: "2", label: "notification channels: email and in-app" }
tldr:
  - "**Problem:** installing large bundles or automations took several minutes, with no feedback."
  - "**Built:** install-completion notifications, and a Tenant Settings entity, API and cache layer from scratch."
  - "**Fixed:** a partial-update bug that erased unrelated settings when one changed."
---

## Problem

In the marketplace, installing large resources, such as **large automations or bundles**, could take several minutes. Users had to wait on screen with no feedback.

## Notifications

- I analyzed the install flow to find where notifications could be triggered without disrupting it.
- I designed and built the integration between our service and the company's **notification platform**, supporting both **email and in-app** notifications, with an email allow-list and the relevant content details in each message.
- I worked with frontend and backend teams so the flow matched the overall experience, and with the team that owns email delivery to configure and enable it.
- I validated the flow end to end by simulating long-running installs and confirming notifications fired correctly.

## Tenant Settings

Opting out of notifications needs somewhere to store the choice, and there was no per-tenant configuration.

- I introduced the **Tenant Settings entity, API and cache layer** from scratch.
- I added notification preferences and wired install notifications to honor them.
- I fixed a **partial-update bug** that dropped unrelated fields: changing one setting could silently erase others.

## Outcome

- Installs run asynchronously; users are told when they finish instead of waiting on screen.
- A foundation for per-tenant configuration.
- Tenants can opt out of specific install notifications without losing their other settings.
