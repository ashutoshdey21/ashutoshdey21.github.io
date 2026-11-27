# CLAUDE.md: public portfolio (ashutoshdey21.github.io)

Public Astro site on GitHub Pages. Local `PLAN.md` (gitignored) has the full plan.

## Goal and constraints
- Portfolio for Ashutosh Dey: engaging for humans, clearly attributable for AI agents and crawlers.
- Private source of truth: `/Users/ashutoshdey/projects/resume-work/data/`. **Read-only. Never write there, never copy raw files here, never commit raw data (not even temporarily).**
- Only public-safe, reviewed, hand-curated content goes in `src/content/`.
- **Zero fabrication:** every claim traces to a line in `data/*.md` or something the user stated. No invented numbers, scope words ("owned", "led", "end-to-end") or technologies. Use "built", "implemented", "migrated" only as far as the source says.
- Positioning: one through-line ("Backend engineer building systems that stay correct under concurrency, failure and access boundaries") plus five lenses: `platform`, `integrity`, `integration`, `reliability`, `ai-engineering`. Config lives in `src/data/positioning.yaml`. `ai-engineering` is the thinnest evidence; never the headline. Usage and impact numbers only as the user's stated estimates, labelled "by my estimate" (see SOURCES.md).

## Decisions (user, 2026-11-26)
- Thryv/Keap and product names may be used. Excluded: ticket IDs, internal repo names, feature-flag names, internal URLs, anything about a private individual (do not use common-achievements item #5).
- The 70% cost reduction (Heroku Postgres to CloudSQL) is cleared; quote it exactly as the source states it.
- **No email address or phone number anywhere.** Contact = GitHub `ashutoshdey21` and LinkedIn `https://www.linkedin.com/in/ashutoshdey` only. Location: San Francisco / Redwood City, CA.
- No headshot. Prose and case studies CC BY 4.0, code MIT.
- The SQS consumer was **not live in production**. Say so plainly.
- Quantify every claim. Use every real number in `data/`; where none exists, state the fact without a number (don't ask the user for one). Never invent a number. User-volunteered estimates are labelled as theirs. User-stated estimates (2026-11-26): dev workflow ran on over 100 tickets; roughly 30% shorter time to merge; no other team members used it yet.
- neurostore: synthetic data only; never imply real patients or production.

## Workflow
- Sync is manual and reviewed, one page at a time: read source, draft public-safe version, list each claim next to its source line, user approves. Track in `SOURCES.md`.
- `npm run denylist` runs in the pre-commit hook and in `npm run build` (so CI). Extra internal terms go in gitignored `denylist.local.txt`; never write them into committed files.
- Git identity: commits publish the author email. Use a GitHub noreply address for this repo, not a personal email.
- Anything on the site must agree with `resume.tex`.
