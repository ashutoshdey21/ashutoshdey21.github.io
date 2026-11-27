---
title: neurostore
summary: A small open-source Python library for storing multi-channel time-series recordings with stimulation event markers, built around write-once files, checksums on every read, and a transactional audit log.
themes: [integrity]
weight: 4
language: Python
repo: https://github.com/ashutoshdey21/neurostore
links:
  - { label: Source on GitHub, href: "https://github.com/ashutoshdey21/neurostore" }
  - { label: Walkthrough, href: "/neurostore/" }
hook: Write-once signal files, SHA-256 checks on every read, and an audit log written in the same transaction. Synthetic data only.
stats:
  - { value: "80", label: "tests, run on Python 3.11 and 3.12" }
  - { value: "0", label: "updates or deletes: append-only by design" }
tldr:
  - "**Integrity:** a checksum recorded at write time is verified on every read."
  - "**Audit:** every read and write, including denied writes, is logged in the same transaction."
  - "**Honest scope:** the README lists what real clinical data would still need."
---

neurostore is a personal code sample, not production software. It covers the collect, store and retrieve loop for EEG-like multi-channel recordings with brain-stimulation event markers such as TMS pulses. **All data is synthetic.** It has never been used with real patients.

## Design

- **Storage.** SQLite holds subjects, sessions, recordings, events and the audit log. Signals are float32 `.npy` files (channels × samples), written once and never modified.
- **Integrity.** A SHA-256 is recorded at write time and verified on every read, so drift between the database and the files raises `ChecksumError`.
- **Audit log.** Every read and write appends a row (actor, action, object ID, UTC time) in the same transaction as the write it describes. Denied writes are logged too.
- **Access.** Read-only by default; writes need an explicit `Role.READ_WRITE`. The caller declares the role, so this prevents accidents, not misuse.
- **Queries.** Time-window reads (`get_window`) and event-locked epochs (`get_epochs`, which returns the data plus a count of skipped epochs).
- **Privacy choices.** Subjects are random UUIDs. Labels are restricted to `[A-Za-z0-9_.-]`, so no free text is stored. `export_deidentified` drops internal IDs, file paths and absolute start times. These are design choices, not a de-identification guarantee.
- **Architecture.** Three layers (`store.py` over `domain/` and `infrastructure/`), with the dependency rule enforced by a test.

Stack: Python 3.11+, numpy, SQLite. 80 tests; CI runs ruff and pytest on Python 3.11 and 3.12. MIT licensed.

## Trade-offs, left out on purpose

- No update or delete: the store is append-only.
- Whole-file reads instead of chunked HDF5 or Zarr.
- A single SQLite writer, no WAL.
- No CLI.

What real clinical data would need, and this library does not provide: encryption at rest, real authentication and authorization, a tamper-evident audit log, formal de-identification and IRB review, and BIDS/EDF formats.
