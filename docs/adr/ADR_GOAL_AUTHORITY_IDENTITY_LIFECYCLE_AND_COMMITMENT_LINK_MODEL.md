# ADR — Goal Authority, Identity, Lifecycle, and Commitment-Link Model

**Status:** Accepted architecture; not implemented

**Date:** 2026-08-23

## Decision

Goal V1 will be an independent durable collection authority. A Goal has one opaque,
never-reused ID; no separate incarnation is needed because V1 has no hard delete
or identity reuse. It has an explicit revision counter, title, optional description,
active/completed/archived lifecycle with recorded transition timestamps, optional
target date, optional versioned measurement-policy reference, and Goal-owned exact
commitment-incarnation links. Qualitative Goals remain valid.

Links are many-to-many, current authored assertions without weights or roles. They
reference source kind, logical ID, and source incarnation. Removal/recreation or
Active replacement never retargets a link; an unavailable link remains explicit
until the user unlinks or relinks it. Goal lifecycle never mutates Commitments or
scheduler behavior.

Goal authority will use its own versioned IndexedDB collection, strict validation,
protection/quarantine, mutation admission, and runtime transaction participation.
It must join a new Backup version, restore, and full clear before Goal UI ships.
Future HistoricalPlan publication must freeze exact Goal/link identity plus the
minimum display/policy context before Goal-linked planning is user-visible.

Progress and Recommendations remain derived and are excluded from Goal authority.

## Consequences

The runtime authority set will expand from five to six participants without
assuming six is final. Profiles neither own nor serialize Goals. Planner will
eventually author Goals; Summary may only read frozen/derived Goal context.

