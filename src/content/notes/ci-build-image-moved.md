---
title: When CI breaks because the build image moved
summary: A base-image upgrade silently moved the JDK from 11 to 17 and broke gcloud with a Python mismatch. Pin what your build depends on.
themes: [reliability]
weight: 3
---

While I was merging a PR, the CircleCI pipeline started failing unexpectedly.

**Read the logs, one dependency at a time.** The underlying Linux image had been upgraded, and that cascaded:

- The **JDK auto-upgraded to 17**, while the system depended on **JDK 11**.
- **gcloud commands failed** because of a Python version mismatch.

**Fix each in isolation.** I upgraded the image deliberately, with controls that prevent unintended JDK upgrades and keep JDK 11 compatibility, then resolved the Python mismatch for gcloud. Isolating each failure meant no fix introduced a new regression.

**Keep the team in the loop.** I shared findings and validated fixes with the team in Slack as I went.

The pipeline was stable again and multiple blocked PRs were unblocked. The takeaway: a base image you don't pin is a dependency you don't control.
