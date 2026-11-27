# SOURCES

One row per public page. Status: draft / reviewed / published. Facts verified: yes/no.
Source paths are relative to the private `resume-work/data/` folder, except `resume.tex` and `linkedin-profile-draft.md`, which are in `resume-work/`.

| Public page | Source file(s) | Last synced | Status | Facts verified |
|---|---|---|---|---|
| `/` home, `positioning.yaml` | results: `resume.tex` 216 (form integration ~20%, 10%), 217 (70%), 218 (35%); `thryv-common-achievements.md` #22 (K6 <1%, p95 <500ms); AI section: `thryv-work.md` line 5, `claude-code-dev-workflow.md` §2–4; looking for: `linkedin-profile-draft.md` line 37 | 2026-11-26 | published | yes |
| `/about/`, `profile.yaml`, `facts.json` | roles/dates/education/skills/certs: `resume.tex` 168–346; titles (CustomerDiscovery "Software Developer", DataSys "Volunteer Research Assistant") and Keap→Thryv: `linkedin-profile-draft.md` 43–88, 196–197; "how I work": `Ashutosh - Software Engineer III.md` 105–128, 325, 438–448, `thryv-work.md` 5, 59 | 2026-11-26 | published | yes |
| `/projects/neurostore/` | `neurostore.md` | 2026-11-26 | published | yes |
| `/projects/agent-dev-workflow/` | `claude-code-dev-workflow.md` (numbers: lines 9, 16, 18–20, 36, 42–45); user estimates 2026-11-26: over 100 tickets, ~30% shorter time to merge | 2026-11-26 | published | yes |
| `/work/advisory-locks/` | `Ashutosh - Software Engineer III.md` (lines 7–43, 227–257); `thryv-common-achievements.md` #7; 35% and "transaction-scoped": `resume.tex` 218 | 2026-11-26 | published | yes |
| `/work/cross-cloud-sqs-consumer/` | `…-sqs-consumer.md` (the SQS consumer notes) (all) | 2026-11-26 | published | yes |
| `/work/debugging-the-unreproducible/` | `Ashutosh - Software Engineer III.md` (lines 139–186, 261–297); `thryv-common-achievements.md` #3, #8 | 2026-11-26 | published | yes |
| `/work/cloudsql-migration/` | `Ashutosh - Software Engineer III.md` 384–426; `thryv-work.md` 41 (intg/stage/prod, machine user, Heroku decommission), 55 (Heroku URLs, CORS, identity URLs); `thryv-common-achievements.md` #1; "led" + 70%: `resume.tex` 217 | 2026-11-26 | published | yes |
| `/work/measure-before-fixing/` | `Ashutosh - Software Engineer III.md` 90–135; `thryv-common-achievements.md` #10 | 2026-11-26 | published | yes |
| `/work/authorization-surface/` | `thryv-work.md` 8–13; `thryv-common-achievements.md` #2, #13–15; `Ashutosh - Software Engineer III.md` 301–380 (Pub/Sub, listener fix), 518–560 (Terraform/SRE, hardcoded region) | 2026-11-26 | published | yes |
| `/work/load-test-gates/` | `thryv-work.md` 34–35 (14 endpoint groups enumerated, <1%, p95 <500ms); `thryv-common-achievements.md` #22 | 2026-11-26 | published | yes |
| `/work/tenant-settings-notifications/` | `Ashutosh - Software Engineer III.md` 564–601; `thryv-work.md` 23, 30–31; `thryv-common-achievements.md` #4, #21 | 2026-11-26 | published | yes |
| `/notes/let-the-queue-count-retries/` | `…-sqs-consumer.md` (the SQS consumer notes) §3, §5 (line 41), §6 (line 48) | 2026-11-26 | published | yes |
| `/notes/five-agents-not-one/` | `claude-code-dev-workflow.md` §4 (lines 30–31) | 2026-11-26 | published | yes |
| `/notes/terraform-plan-surprise/` | `Ashutosh - Software Engineer III.md` 518–560 | 2026-11-26 | published | yes |
| `/notes/ci-build-image-moved/` | `Ashutosh - Software Engineer III.md` 190–223 | 2026-11-26 | published | yes |
| `/resume/`, `resume.pdf` | `resume/resume.tex`, generated from `resume-work/resume.tex` minus email, phone, intern bullet and "Open to learn" line; titles per `linkedin-profile-draft.md` 197 | 2026-11-26 | published | yes |

## Verification log

**2026-11-26, Phase 1 verification (live site):**
- Claims: every page has a claim-to-source table reviewed in session; every number on the site (39) appears in a source file or in the user's stated estimates.
- Denylist: clean on source and on built `dist/`.
- Lighthouse 12.8.2 (mobile) on `/`, `/about/`, `/work/cross-cloud-sqs-consumer/`: 100 for performance, accessibility, best practices and SEO.
- JSON-LD: 8 blocks checked against the schema.org vocabulary (types and property domains): 0 errors.
- JavaScript disabled: no client JS ships; all 10 content pages render with content.
- Width: no horizontal overflow at 360px or 1280px on all 10 content pages.

**2026-11-26, redesign (progressive disclosure):** card hooks, stats and TL;DR lines added to front matter for all five entries, restating facts already in each page's sources (no new claims). Full write-ups moved behind a "Read the full case study" toggle; still server-rendered and in the `.md` twins.
