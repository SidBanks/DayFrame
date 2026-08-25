# ADR — User-Initiated Evidence Writes and Today Evaluation Cutoff Advancement

## Status

Accepted — 2026-08-24

## Context

Today evaluates HistoricalPlan and ExecutionHistory at an explicit fixed `evaluationAsOf`. Passive authority notifications must preserve that cutoff, but a successful Today outcome action creates evidence after it and would otherwise remain invisible until Refresh.

## Decision

An accepted user-initiated Today ExecutionHistory report, correction, or retraction advances that mounted Today surface's cutoff to a fresh canonical app-clock instant and triggers a canonical re-query. Rejected or failed writes do not advance it. Passive authority notifications continue to re-query the existing cutoff. Refresh continues to capture a fresh cutoff independently.

The accepted write is never displayed from optimistic shadow state. Exact occurrence identity remains bound to the initiated command, while the newest canonical plan/query result governs presentation.

## Consequences

The action becomes immediately and truthfully visible, passive evidence cannot silently move the user's evaluation point, and race handling remains governed by query generations and authority transactions. This rule creates no new clock, authority, or persistence state.
