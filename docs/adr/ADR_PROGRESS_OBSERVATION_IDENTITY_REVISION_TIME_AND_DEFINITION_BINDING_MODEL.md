# ADR — Progress Observation Identity, Revision, Time, and Definition-Binding Model

**Status:** Accepted  
**Date:** 2026-08-23

## Context

DayFrame needs durable measured-state evidence before it can truthfully derive
Progress. Evidence must remain reconstructible across corrections, retractions,
definition revisions, late entry, backup, and restore.

## Decision

Progress Observation is an independent durable authority. An opaque UUID identifies
one logical observation lineage; positive integer revisions are immutable append-only
records. Corrections and retractions preserve Goal, exact Measurement Definition
ID/revision, and unit binding. Retraction copies the prior value and observed time,
with status controlling effectiveness. Correction after retraction is not supported.

`observedAt` is measurement time. `recordedAt` is DayFrame knowledge time and governs
revision visibility at `evaluationAsOf`. Backdating is allowed only inside the bound
active definition epoch; future-dated evidence is rejected. For V1 absolute quantity
evidence, more than one effective active lineage at the same Goal, exact definition
revision, and observed time is rejected.

Normal authoring supports only `manualQuantityTarget@1`, stores an absolute canonical
unsigned decimal (including zero and values above target), and inherits the exact
definition unit without conversion. The authority stores evidence only: it does not
derive a ratio, percentage, pace, status, recommendation, or adaptation.

Backup V6 contains complete observation revision history. V5 and older whole-authority
restores explicitly install an empty observation authority.

## Consequences

Historical knowledge can be reconstructed without rewriting evidence, and future
Progress can deterministically select the latest effective observation by measurement
time after applying knowledge-time visibility. Historical Measurement Definition
revisions cannot be hard-deleted while observations reference them. A future explicit
reactivation operation or broader policy schema requires a separate decision.
