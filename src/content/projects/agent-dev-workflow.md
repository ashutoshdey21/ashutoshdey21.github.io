---
title: Multi-agent ticket-to-PR workflow
summary: A Claude Code slash command I built at Thryv that takes a Jira ticket to a pull request through five sub-agents, each limited by which tools it is allowed to use.
themes: [ai-engineering, reliability]
weight: 3
---

A custom Claude Code slash command, `/dev-workflow <ticket>`, that I built for a backend microservice repo at Thryv. It runs a phased pipeline from Jira ticket to pull request by handing off to five sub-agents in sequence. The orchestrator does no work itself; it routes on the sub-agents' structured outputs. A separate `self-reflect` agent runs on demand.

## By the numbers

- **6 agents** (5 in the pipeline plus `self-reflect`), **6 skills**, and a **3-tier permission policy: 19 allowed, 7 ask-first, 6 denied** commands.
- **8 review categories** in verification; **3-strike** build retry; remediation **capped at 3 passes**.
- **About 5 months of accumulated learning** (late April to mid-September 2026): **41 memory files, 30 of them feedback rules**, some also written into agent instructions, consistent with the `self-reflect` loop.
- Two surviving runs show the loop end to end: one reached Ready after **2 remediation passes**; the other reached Ready in **0 passes** and opened a draft PR of **23 files, +585 / −160 lines**.

These are a floor, not a total: run state is deleted after merge and nothing logs invocations, so there is no measured count of runs, time saved, or false Ready verdicts.

## Pipeline

1. **Setup.** Identify the ticket, choose a worktree or the main checkout, and halt if a branch or worktree already exists (locally or remotely), if previous state exists, or if the working tree is dirty.
2. **`jira-analyzer` (Sonnet).** Reads, creates or grooms the ticket through 15 enumerated Atlassian MCP tools. Halts on an empty description or scope over about a week. Never guesses required fields; flags ambiguities as `CLARIFICATION NEEDED:`.
3. **`code-planner` (Opus, read-only).** Writes a file-by-file plan. It must sample two or three existing files of each type and cite them, and may only reference codebase elements that actually exist. It carries design-default rules derived from real PR review feedback.
4. **`implementation` (Opus).** The only agent that can edit source. Works in a fixed order (domain, infrastructure, application, tests), retries a build failure three times and then halts, cannot touch generated SDKs or lockfiles, and is forbidden from silencing failures (skipping tests, `@Disabled`, `--no-verify`). Implements only what the plan describes, and can fan out parallel sub-agents for independent file groups that share no state.
5. **`verification` (Opus, read-only, deliberately cannot run the build).** Static review across eight categories: requirements coverage per acceptance criterion, architecture and layering, conventions, edge cases, test coverage, security, breaking changes, and generated-file hygiene. Verdict: Ready, Needs Attention, or Not Ready. It identifies problems and never suggests fixes. It has checks against self-deception: for example, it greps the source for coverage rather than trusting the plan, and must report tightened auth on an existing endpoint as a breaking change.
6. **Remediation loop.** A non-Ready verdict goes back to implementation, one todo per finding, smallest change first. A finding can be marked wrong but not silently skipped. Capped at three passes, then it halts.
7. **`ship-it` (Sonnet, cannot edit code by construction).** Halts unless the verdict is Ready. Runs tests and checks, stages files explicitly by path (never `git add -A`), commits, pushes, and opens a PR that follows the repo's template. Cross-checks the PR description against what was actually implemented. No force-push, amend or merge.

The user confirms at every phase boundary; the pipeline never advances silently.

## Feedback loop

`self-reflect` pulls the reviewer comments on a PR and compares three things: what the agents planned, what they built, and what reviewers found. It maps each gap to the agent that should have caught it, looks specifically for false Ready verdicts, then makes one targeted edit to that agent's instructions and records one memory file per learning. It also keeps instruction files within token budgets, and never touches source code.

## Design decisions

- **Five agents instead of one,** for three reasons: capability removal (tool allowlists mean `ship-it` cannot edit and `verification` cannot build), independent context windows, and worktree isolation. The design notes say to collapse back to one agent if those reasons stop holding.
- **Model tiering.** Judgment-heavy agents (planner, implementation, verification) use Opus; mechanical ones (Jira I/O, git and PR) use Sonnet.
- **Permissions in three tiers.** Read-only git and build commands are allowed; every mutating operation (push, commit, branch, PR create, edit, merge or comment) asks first; force-push, `reset --hard`, `clean -f` and `rm -rf` are denied.
- **Adapted, not copied.** It was ported from an earlier pipeline, with a documented table of deliberate differences.
