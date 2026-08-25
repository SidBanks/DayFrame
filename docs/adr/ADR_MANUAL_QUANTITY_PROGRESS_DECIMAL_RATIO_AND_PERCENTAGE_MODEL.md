# ADR — Manual Quantity Progress Decimal Ratio and Percentage Model

**Status:** Accepted  
**Date:** 2026-08-23

## Decision

Manual Quantity Progress is a pure, non-persisted interpretation of one effective
absolute quantity observation divided by the positive target from the same exact
`manualQuantityTarget@1` Measurement Definition revision.

Raw canonical numerator and denominator strings remain in the result. Comparison
and division use bounded BigInt scaled-integer arithmetic rather than binary
floating point. The canonical percentage is rounded half-up to at most four decimal
places and trailing zeros are removed. It is not clamped at 100 percent. Thus
`1 / 3` yields `33.3333`, `12400 / 50000` yields `24.8`, and `110 / 100` yields
`110`.

Goal lifecycle and target date are context only. Goal Activity, HistoricalPlan,
ExecutionHistory, scheduling state, and deprecated Goal measurement-policy metadata
are not inputs. Percentage is an arithmetic fact and cannot mutate Goal lifecycle.

## Consequences

The result is deterministic across platforms and Backup/restore while preserving
the exact authored/evidentiary quantities. Future display formatting may use the
ratio independently, but changing core percentage precision or rounding requires a
new policy/version decision.
