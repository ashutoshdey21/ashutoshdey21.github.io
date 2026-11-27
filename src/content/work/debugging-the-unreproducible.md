---
title: Debugging the unreproducible
summary: Two bugs with no easy repro. One needed a third-party provider to fail on demand; I forced it inside an integration test and traced it to transaction boundaries. The other failed exports across teams; I instrumented the HTTP client and found the cause in about an hour.
themes: [reliability, integrity, integration]
weight: 5
context: Solution Launchpad, Packaging Service (Thryv/Keap)
stack: [Java, Micronaut, JPA transactions, HTTP client filters]
---

Both bugs had the same shape: the symptom showed up in one place, the cause lived somewhere you could not easily reach, and guessing was expensive. The approach in both was to **make the failure deterministic first, then instrument**.

## 1. Duplicate resources when a provider failed

### Problem

In Solution Launchpad, exporting a resource created **duplicate tracked resources** whenever the third-party content provider threw an exception. Reproducing it in a real environment meant forcing a third-party provider to fail, which was not feasible.

### Approach

- **Moved the failure into a test.** I modified an integration test to simulate the provider failure, which gave a controlled, repeatable repro. That meant first learning how the test framework was structured so I could add a targeted case for this edge.
- **Stepped through the export flow line by line** to see how shared resources were handled when the failure hit.
- **Followed the transaction boundaries.** Analyzing how `@Transactional` and `@Transactional(TxType.REQUIRES_NEW)` shaped transaction boundaries and failure handling led to the root cause.

### Outcome

- Duplicate tracked resources **no longer created** on export failures.
- A **controlled repro inside the test suite** instead of an unpredictable external failure.
- A method for bugs you cannot reproduce live: **simulate the external failure in a test** instead of waiting for it.

## 2. Exports failing across teams, root cause in about an hour

### Problem

During Solution Launchpad end-to-end testing, a QE engineer flagged failures: **Email Broadcast** exports containing Keap file URLs were failing, and **Landing Pages** reported similar failures. The symptom surfaced in the Packaging Service, but it was unclear which dependency was at fault, and the bug risked reaching higher environments.

### Approach

- **Picked it up from the QE thread on my own initiative** and started from Packaging Service logs. The export adapter called **three URL-mapping providers** (template, form and appointment) for every URL.
- **Got a deterministic repro:** replicated the failing resource in the integration environment, then pulled it into a local instance to debug under controlled conditions.
- **Instrumented what the logs could not show.** Existing logging did not say which downstream client failed, so I added an `HttpClientFilter` with a `FilterMatcher` on the request path to isolate it.
- **Root cause:** the appointment URL-mapping provider returned **unauthorized**. Because the adapter calls all three providers for every URL, that one failure failed the **entire export**.
- Posted the findings in the thread so QE, development and product had the same picture, then walked the owning team's lead through the trace on a call.

### Outcome

- Root cause found in **about 1 hour**, in a service **outside my team's ownership**.
- A clean release decision: the appointments service was **held off the release train for the week** while its team fixed the auth issue, so the bug **never reached higher environments**.
