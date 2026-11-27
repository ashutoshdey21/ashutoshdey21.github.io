---
title: When the Terraform plan shows changes you didn't make
summary: Unexpected changes in a Terraform plan are a signal that someone else is mid-change. Stop, find out who, and decouple your work from theirs.
themes: [reliability, platform]
weight: 3
related: /work/authorization-surface/
---

I was adding a Pub/Sub subscription through Terraform when the plan showed modifications I hadn't made.

**Don't apply through it.** The unexpected changes came from database migrations the SRE team was running across regions. Applying my change risked conflicting with their in-progress work.

**Coordinate, then wait.** I confirmed with SRE that my change had to wait for their migration, and helped test our service's database changes in the integration environment in the meantime.

**Decouple so nothing stalls.** I tracked the infrastructure change and the migration under one ticket for visibility, and kept the application logic moving on a separate ticket. When the migration finished, I merged the subscription safely.

**Read the config while you're there.** Reviewing the setup, I found a hardcoded region in the Cloud SQL configuration, filed a ticket, and replaced it with a variable.
