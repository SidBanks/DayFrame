# ADR — Publication Lifecycle and Replacement Isolation V1

**Status: Accepted for bounded implementation under Task 9.29.2; implementation pending its reviewed RESULT.**

The user's Task 9.29.2 accepts `docs/architecture/PUBLICATION_LIFECYCLE_AND_REPLACEMENT_ISOLATION_CONTRACT_V1_PROPOSED_RESULT.md`, SHA-256 `0d578e820645f8fb023e35fec501501f9582809f185ee9801c69e076a47393f5`, together with the clarification below. The original proposal remains unchanged.

Task 9.29's PARTIAL/BLOCKED RESULT and retained real-adapter diagnostics demonstrate delayed publication writing after successful full clear and V14 restore, with the displaced batch surviving restart. Task 9.29.1's separate COMPLETE architecture-resolution RESULT supplies the proposed ordering and evidence limits. Neither report certifies repaired behavior.

Accept origin capture before asynchronous dispatch, generation/epoch identity, serial queued intent, executing-head settlement lease, physical admission and native terminal receipt, protected certainty, and combined before-snapshot replacement admission. Preserve the existing private coordinator, staging/journal, rollback and recovery authority. Guarantees cover one registered store/owner in one live JavaScript realm, not concurrent tabs, stores or devices.

**Queue-admission clarification:** Healthy current-origin publication calls may join the supported serial queue while another healthy publication executes. Only the executing queue head holds replacement exclusion. Ordinary in-flight publication is not a blanket busy rejection of later submissions. Active replacement, displaced origin, protection and unconfirmed physical settlement retain the accepted restrictions. Test submission B after A's physical transaction starts.

No schema, durable format/version, migration, persisted operation ledger, dependency, historical cleanup or capability retirement is authorized. Publication identity/time and supported frozen evidence/readers remain unchanged. Runtime-only admission, receipts and outcome additions are authorized. Structure temporal policy remains unchanged.

Task 9.29.2's reviewed RESULT must establish implementation, permanent phase-selected regressions, native/current-surface mobile evidence and unchanged hard bundle gates. Task 9.29 workflow convergence remains pending separate explicit continuation and acceptance.
