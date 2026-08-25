# ADR — Production Surface Loading and Bundle Budget Architecture

**Status:** Accepted

**Date:** 2026-08-24

## Context

After Task 5.18, production JavaScript was one 704.36 kB (174.20 kB gzip)
chunk. The application now has a stable default Planner surface and an independent
Summary destination, so its real dependency graph supports a durable loading policy.

## Decision

- Keep authority bootstrap, the canonical store, restore/full-clear coordination,
  runtime transactions, and the default Planner surface eager.
- Load Summary as one product-surface chunk, with an accessible fallback, bounded
  failure UI, and focus/hover intent preload.
- Emit React, ReactDOM, and Scheduler as one stable `vendor-react` chunk.
- Keep Settings/Backup eager because it is part of the always-present workspace
  shell, not an independently navigable surface. Do not split Planner merely to
  reduce the entry filename: it is the initial experience and owns app-level drafts.
- Keep shared CSS global and avoid component-level fragmentation.
- Do not raise Vite's warning threshold to hide bundle structure.
- Enforce production-manifest budgets: initial raw JS <= 685,000 bytes, initial
  gzip <= 170,000 bytes, largest lazy chunk <= 100,000 bytes, and total emitted JS
  <= 750,000 bytes. Any task adding more than 25 kB to initial JS requires explicit
  bundle review even if these ceilings still pass.

## Consequences

Summary can be cached and fetched independently while all authority and restore
semantics remain eager and singleton. The guard measures the static entry closure,
lazy chunks separately, and total JavaScript so redistribution cannot masquerade as
byte reduction. Further splitting requires evidence of a meaningful product boundary.
