---
title: Five agents instead of one, and when to go back
summary: Splitting an AI coding workflow into five agents is only worth it while three things hold. The design should say what they are, and when to undo it.
themes: [ai-engineering]
weight: 3
related: /projects/agent-dev-workflow/
---

My ticket-to-PR workflow uses five agents. More agents is not automatically better, so the design notes give the reasons, and a rule for undoing it.

1. **Capability removal.** Each agent gets an explicit tool allowlist. The verification agent deliberately cannot run the build; the shipping agent cannot edit code. A single agent holding every tool couldn't be limited that way.
2. **Independent context windows.** Each agent starts from its own context rather than one long shared conversation.
3. **Worktree isolation.** Work happens in a separate worktree, away from the main checkout.

**The collapse-back rule:** if those three reasons stop holding, merge back to one agent. Writing down the exit condition keeps the architecture honest.

Model choice follows the same logic. Agents that need judgment (planning, implementation, verification) use a stronger model; mechanical ones (Jira I/O, git and PR) use a lighter one.
