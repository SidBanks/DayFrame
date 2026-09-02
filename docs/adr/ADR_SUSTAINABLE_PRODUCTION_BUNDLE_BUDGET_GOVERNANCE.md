# ADR — Sustainable Production Bundle Budget Governance

**Status:** Accepted

**Date:** 2026-08-26

**Supersedes:** The fixed total-JavaScript hard ceiling and governance semantics in
`ADR_PRODUCTION_SURFACE_LOADING_AND_BUNDLE_BUDGET_ARCHITECTURE.md`. Its loading and
chunk-boundary decisions remain accepted.

## Context

Task 5.19 introduced four fixed production limits after splitting a 704.36 kB
monolith: initial raw 685,000 bytes, initial gzip 170,000 bytes, largest lazy chunk
100,000 bytes, and total emitted JavaScript 750,000 bytes. The first three directly
guard startup and surface-loading regressions. Total size ensured that moving bytes
between chunks could not masquerade as reduction, but the record did not establish
a permanent fixed-size product philosophy.

The current correctly split product is 630,499 initial raw, 160,954 initial gzip,
51,479 largest lazy, and 749,882 total bytes. Task 7.2A found no safe local reduction.
Task 7.2B found singular module ownership, clean lazy surface boundaries, and no
production duplication. Since Task 5.19, total output grew 43,483 bytes while initial
raw fell 45,809 bytes and initial gzip fell 7,244 bytes as Today, converged planning,
contextual workflows, and Month became real product capabilities. The remaining
118-byte total margin therefore limits intended capability rather than detecting a
demonstrated loading or duplication regression.

## Decision

Adopt a hybrid policy:

- Keep hard limits unchanged for initial raw (685,000), initial gzip (170,000), and
  largest lazy chunk (100,000). A value equal to a hard limit passes; a value one byte
  above fails.
- Introduce headroom warnings at 650,000 initial raw, 161,500 initial gzip, and
  80,000 largest lazy. Equality enters the warning state.
- Continue counting and reporting every emitted production JavaScript chunk,
  including React/vendor code. Total JavaScript is advisory: warn for a growth review
  at 800,000 bytes and require an architecture review at 825,000 bytes. Equality
  activates each milestone; neither milestone fails CI by itself.
- Derive the rounded total milestones from the verified 749,882-byte known-good
  product: approximately 50 kB of normal governed growth before warning and 75 kB
  (about ten percent) before mandatory architecture review. They are review points,
  not automatic ratchets or permissions for unlimited growth.
- Preserve the existing rule that a task adding more than 25 kB to initial JavaScript
  needs explicit bundle review, even if hard limits pass. An unexplained material
  jump in any metric also requires investigation and may block acceptance through
  review, rather than through a brittle checked-in per-task baseline.
- Require explicit bundle-impact review for a new runtime dependency, a material
  framework/toolchain output jump, a new primary surface, or a material compatibility
  family expansion. Perform a detailed trend/ownership review at phase boundaries.
- A warning requires attribution and a documented response in the task result. The
  architecture-review milestone requires a source-map ownership/duplication audit and
  a governed ADR decision before the milestone may be revised.

The policy must not be gamed by excluding vendor or emitted chunks, fragmenting a
coherent surface, changing compression/minification, weakening compatibility, or
retiring capability solely to satisfy accounting. Compatibility retirement and hard
limit changes require their own evidence and governance.

## Metric semantics

- Initial raw is the raw byte sum of the entry and its static import closure; it is a
  proxy for startup parse/compile and catastrophic eager-import risk.
- Initial gzip is the gzip byte sum of that closure; it is the closest current guard
  to startup transfer size.
- Largest lazy is the largest emitted JavaScript file outside the initial closure; it
  is a proxy for contextual loading and parse bursts, not an invitation to split code
  artificially.
- Total JavaScript is the raw sum of all emitted JavaScript. It preserves trend and
  exposes sudden dependency/duplication growth, but is neither direct startup cost nor
  a complete maintainability measure.

## Consequences

Startup and contextual-loading regressions still fail deterministically. Legitimate
lazy product growth is visible and governed without silently becoming feature or data-
retention policy. Task 7.3 can proceed with 50,118 bytes to the total warning and
75,118 bytes to architecture review, while its eager impact remains constrained by
the unchanged hard limits. Byte guards remain proxies; production performance and
source-map ownership still require separate validation when risk warrants it.
