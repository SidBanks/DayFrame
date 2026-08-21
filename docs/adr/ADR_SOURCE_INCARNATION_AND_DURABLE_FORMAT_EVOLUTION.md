# ADR — Source Incarnation and Durable Format Evolution

**Status:** Accepted  
**Date:** 2026-08-20  
**Decision scope:** Lifetime-bearing authored sources, active persistence, saved profiles, and backups  
**Builds on:** `ADR_DURABLE_DATA_COMPATIBILITY_AND_FORMAT_VERSIONING.md`, Tasks 2.24–2.26

## Context

DayFrame source IDs are readable current-snapshot identifiers and may be reused after deletion. Runtime `OccurrenceIdentity` V1 is therefore unsuitable as a durable foreign key. Task 2.24 defined source lifetime semantics and selected a separate future durable occurrence reference. Task 2.25 made interactive create/update/delete/replace intent explicit, so lifetime continuity no longer needs to be guessed from snapshots.

Current durable surfaces differ:

- active state is an un-enveloped legacy representation at `dayframe-store-v1`;
- the profile collection has a Version 1 envelope and stores reusable setup snapshots;
- backup files have a Version 1 envelope and are user-held recovery artifacts.

No current source contains lifetime identity. No durable PlanDecision exists.

## Decision

### Source-incarnation meaning

A source incarnation identifies exactly one continuous lifetime of one authored source within its source-ID scope. It is immutable and opaque. It carries no creation time, ordering, user, device, or content semantics.

Lifetime-safe source identity is conceptually:

```text
source kind + parent lifetime scope where applicable + source ID + incarnation ID
```

Every block template, block recurrence, manual event, shift definition, shift cycle, cycle segment, and sequence entry requires an incarnation in the future authoritative runtime/active model.

### Token representation

Use a branded immutable string whose serialized representation is a canonical lowercase RFC 4122 UUID Version 4. It must be generated from a cryptographically strong random source, work offline, and remain stable through cloning and serialization. Equality is exact string equality. Tokens are globally unique within an active source graph; routing and semantic equality still retain source kind, source ID, and parent lifetime rather than treating the token alone as a source reference.

No timestamp, user/device identifier, readable source data, local counter, or content hash is encoded.

### Lifecycle allocation

| Operation | Preserve | Allocate | Retire prior lifetime |
| --- | ---: | ---: | ---: |
| lifecycle-aware update | yes | no | no |
| create/default creation | no | yes | no |
| delete | no | no | yes |
| delete/recreate | no | yes for recreated source | yes |
| explicit replace | no | yes | yes |
| duplicate/copy | no | yes | no |
| profile activation | no | yes for every instantiated source | replaces active graph |
| current-format active rehydration | yes | no | no |
| recovery restore | yes | no | replaces active graph |
| legacy active migration/import conversion | no historical token | yes baseline | establishes boundary |

Task 2.25 lifecycle operations are authoritative for interactive allocation. Snapshot comparison may validate an explicit claim but may never choose preservation versus allocation.

### Source scopes and nested identity

Top-level IDs are scoped by source kind/collection. Segment and sequence-entry IDs share a cycle-local work-entry namespace. Nested durable identity includes the parent cycle's full lifetime identity, the nested kind/ID, and the nested incarnation. Parent and child incarnations are both required. Recreating a parent allocates a new parent incarnation and new incarnations for all newly created children; an old nested reference fails even if either independent discriminator were accidentally equal.

### Runtime and artifact representations

The future authoritative runtime source types contain mandatory `incarnationId` identity metadata. Durable surfaces use explicit, surface-specific DTOs rather than continuing to serialize `DayFrameAuthoredSetup` indiscriminately.

- **Active V2:** a new explicit envelope, written to a new V2 storage key, contains an active-authored schema version and mandatory incarnation on every lifetime-bearing source. Writers never omit or synthesize fields during ordinary V2 normalization.
- **Profile V2:** an independently versioned reusable-pattern DTO intentionally omits active incarnation. Saving projects authored values/relationships into the pattern. Every activation allocates a coherent fresh active graph, including every nested source. Repeated activation produces distinct incarnations.
- **Backup V2:** an independently versioned `activeRecovery` envelope includes all source incarnations and restores them exactly. It is not a reusable-pattern artifact. A future “fork/import as new” action must be explicitly distinct and allocate new incarnations.

The source ID field remains in every representation. Profile pattern IDs preserve internal relationships but do not assert active lifetime.

### Restore versus instantiate

Ingress authority, never payload resemblance, determines semantics:

- current-format active rehydration and Backup V2 recovery are **restore** and preserve incarnation;
- profile activation and Backup V1 conversion are **instantiate/baseline** and allocate incarnation;
- initialization/default creation is ordinary creation and allocates incarnation;
- injected test state remains scaffolding and must use an explicit current-format constructor once incarnation is implemented.

Backup V1 remains supported. Because it contains no incarnation, import validates/converts it and establishes fresh active baseline lifetimes. DayFrame does not claim recovery of pre-incarnation identity.

### Active migration

Migration from the implicit active V1 representation to Active V2 is eager, all-or-nothing, and precedes adoption of incarnation-bearing runtime authority:

1. read and preserve raw V1;
2. parse through the supported V1 compatibility adapter;
3. normalize and semantically validate the entire authored graph;
4. allocate one fresh baseline incarnation per source, including nested sources;
5. construct and validate the complete V2 envelope;
6. serialize it;
7. write it atomically to the distinct V2 key;
8. reread/validate the durable V2 checkpoint;
9. only then adopt it as runtime authority.

A valid V2 checkpoint is preferred. Once V2 exists, V1 is recovery material, not a silent fallback that may supersede newer data. Removal of V1 data/readers requires the evidence and review mandated by the durable-data ADR.

The baseline token proves continuity only from successful migration forward. It reconstructs no earlier delete/recreate history.

### Migration failure

Failure before verified V2 durability leaves raw V1 authoritative and untouched. The application must not expose a transient incarnation graph as successfully migrated. It enters an observable protected migration/recovery state and may retry. Existing persistence outcome categories (`unavailable`, `serializationFailure`, `storageFailure`) remain the write-failure vocabulary; ingress must additionally distinguish migration failure from malformed/unsupported data.

If V2 writes successfully but runtime activation later fails, V2 remains the durable checkpoint, is protected, and is not overwritten or silently replaced by V1. No success marker exists apart from a valid durable V2 envelope.

### Profile evolution

Profiles version independently. Profile V1 remains readable and converts to incarnation-free Profile V2 pattern data. Collection rewrite, if performed, is atomic and preserves/quarantines unconvertible raw entries; filtering or silently dropping them is prohibited. Profile activation, not profile migration, allocates active incarnations.

### Backup evolution

Backup V1 remains a long-lived supported input and converts by baseline instantiation. New exports use Backup V2 recovery semantics and include incarnation. Unknown versions are explicitly rejected/preserved with recovery guidance. Backup source files are never rewritten during import.

### Validation

Current authoritative/Active V2 and Backup V2 require a syntactically valid canonical UUID v4 on every source. Missing, empty, malformed, or duplicate incarnation values are invalid. Incarnation duplication anywhere in one active/recovery graph is invalid even across source kinds; nested ID uniqueness remains cycle-local and source ID uniqueness remains governed by authored validation.

Profile V2 rejects active-incarnation fields as semantically misplaced rather than interpreting them. Profile V1 and Backup V1 are valid historical formats without incarnation and enter only through their explicit adapters. Unknown future versions are unsupported, not legacy.

Structural validation and semantic source/reference resolution remain separate.

### Cloning, equality, and deterministic planning

Incarnation is an immutable scalar and is copied exactly in runtime snapshots, active clones, and recovery backups. Profile projection omits it. It must not affect scheduling choices or generated occurrence coordinates.

- same source lifetime: same scope, kind, ID, and incarnation;
- different lifetime: different incarnation regardless of equal ID/content;
- current runtime occurrence equality: unchanged `OccurrenceIdentity` V1;
- future durable occurrence equality: separately versioned `DurableOccurrenceReference` containing complete source lifetimes plus canonical coordinates.

Random token allocation does not violate planning determinism: equivalent established authoritative inputs contain the same persisted tokens; new source creation is an authoring identity event, not scheduling derivation.

### Deletion, history, and reset

Deletion removes the source; durable incarnation needs neither tombstones nor retired-source history. A reference to an absent incarnation does not resolve. Clear/reset ends the active graph, and subsequent created/default sources receive fresh tokens.

## Compatibility matrix

| Input | New reader behavior |
| --- | --- |
| Active V1 | validate, atomically migrate to V2 baseline, then activate |
| Active V2 | validate and restore incarnations exactly |
| Profile V1 | read/convert as reusable pattern; allocate on activation |
| Profile V2 | read as reusable pattern; allocate on activation |
| Backup V1 | read/convert; instantiate baseline active lifetimes |
| Backup V2 `activeRecovery` | validate; restore incarnations exactly |
| unknown future version | preserve/reject explicitly; never guess |

## Failure matrix

| Failure | Required behavior |
| --- | --- |
| parse failure | protect original; recovery required; no migration write |
| validation failure | protect original with explicit issues; no activation/write |
| migration construction failure | protect V1; no partial runtime graph |
| incarnation allocation failure | protect V1; retryable migration state |
| serialization failure | retain V1; existing serialization-failure semantics |
| storage access failure | retain/protect source where accessible; unavailable status |
| durable write failure | retain V1; storage-failure status; migration incomplete |
| V2 activation failure after write | protect V2; no V1 silent fallback/overwrite |

## Consequences

- Active, profile, and backup schemas evolve independently.
- `DayFrameAuthoredSetup` can remain a runtime convenience only if it represents incarnation-bearing active authority; it is no longer the universal durable DTO.
- The first implementation must coordinate source fields, allocation/validation, Active V2 envelope/key, and atomic V1 migration. Runtime-only incarnation is prohibited.
- Profile and backup implementation can follow independently, but durable references/PlanDecisions must wait until active incarnation and migration are complete.
- Existing V1 readers remain until evidence-based retirement.

## Non-decisions

This ADR does not implement fields, generators, migrations, serializers, profile/backup changes, `DurableOccurrenceReference`, PlanDecision, tombstones, history, or UI.
