# Current consumer union and certainty audit — RESULT

Audit targets: retained ScheduleReviewWorkspace/Panel, shared scheduleReviewReadiness/publicationBlockers, plannerReviewPresentation, reviewSourceFeedback, planningResultCopy, existing corrective handlers. The additions are UI copy and presentation focus, not owner policy.

## Read contract

The workspace consumes `PlanningReviewReadModelV2` directly. Loading/error and read identity (query owner, scope, refresh/as-of, invalidation revision) remove Ready before a new result can install. Effect cleanup rejects late read delivery. Source qualification is not defaulted healthy. Canonical `publicationBlockers` governs publication readiness; receipt currentness cannot override it.

Shared source copy handles all eight sources (proposal, realization, activeSetup, planDecision, composition, goal, sleepFoundation, historicalPlan) and all nine issue reasons (initializing, readUnavailable, protected, writeInProgress, commitUnconfirmed, verificationFailed, coverageIncomplete, pendingDurability, qualificationUnavailable). Readable family rows and their coverage remain separate. Unknown realization is not an assertion that every acceptance is unscheduled. Healthy no-history is not protected history; healthy pending offers are nonblocking. Readiness maps every current canonical blocker, plus invalid local range and informational pending offers. Retained qualification/readiness tests and final native 11/12 exercise these distinctions.

## Proposal

`accepted`, `unconfirmed`, and `rejected` are handled separately. `unconfirmed` distinguishes commitStateUncertain and verificationFailedAfterCommit and never invites reacceptance. All 16 rejection reasons are independently covered by typed delivery tests: proposalBusy, contextReplaced, sourceChanged, authorityUnavailable, authorityProtected, replacementBusy, initializing, protected, authorityTransactionActive, notFound, notActionable, stale, invalidInput, conflictingClaim, allocationFailure, persistenceFailure. Previously generic fallback reasons now have explicit, exhaustively typed copy.

The exact outer object is retained; recognized non-enumerable receipt currentness gates success feedback/refresh. Accepted work's nested realization remains the original object and has a separate currentness check. A displaced nested result explains earlier-context scheduling; a displaced outer result installs no current success. The consumed owner's fresh accepted path is verified durable; the broader type's persistence member is not used to manufacture a new durability or retry policy.

## Realization

All nine statuses are covered: realized, alreadyRealized, conflicted, inapplicable, invalid, failed, rejected, protected, unconfirmed. Every reason in the current 17-member union is passed through the existing typed `realizationReasons`: sleepFoundationReviewRequired, alreadyRealized, acceptedAllocationIncomplete, acceptedAllocationInvalid, claimGeometryMismatch, claimIdentityMismatch, scheduleConflict, atomicPersistenceFailure, sourceUnavailable, sourceChanged, realizationBusy, replacementBusy, contextReplaced, authorityUnavailable, authorityProtected, commitStateUncertain, verificationFailedAfterCommit.

Successful/already-realized results distinguish reviewRequired. Known conflict/failure keeps acceptance separate from scheduling. Rejected/protected/unconfirmed results use owner-specific reasons without false saved/no-write assurances. Existing current-receipt checks guard explicit retry results. Owner suites certify alreadyRealized identity/Capacity nonduplication; the consumer seams certify presentation and reference identity, not simulated storage correctness. Native 11 executes actual failed realization followed by explicit successful retry with no reacceptance.

## Publication

`published` / `alreadyPublished` are durable outcomes, with independent reviewRequired copy and qualified requery. All 21 refusal reasons are covered: contextReplaced, publicationBusy, pendingPublication, invalidPublicationRange, planningCoverageIncomplete, previewMissing, previewStale, previewRangeMismatch, frictionUnresolved, acceptedAllocationUnrealized, sourceChanged, queryFailure, materializationFailure, persistenceFailure, historicalPlanProtected, historicalPlanUnavailable, tryPreview, verificationFailedAfterCommit, commitStateUncertain, writeFailedBeforeCommit, publicationSourceUnqualified. The first 20 have typed consumer delivery cases; structured source qualification uses retained actual owner/UI tests and final native 11. SourceIssues and the original non-enumerable publication receipt are retained, not JSON-reconstructed.

Known `writeFailedBeforeCommit` alone gives the no-new-plan assurance; uncertainty/failed verification explicitly allow that history was written. `pendingPublication` is not called durable. Actual post-admission source change proves saved publication can require review; actual post-commit verification failure preserves physical history and does not claim nothing was saved. Native 9 proves fresh durable no-op after exact restore/reload.

## Request and lifetime handling

The retained synchronous shared request token prevents duplicate submissions across unmount. Feedback cells bind to the originating scope; storing the original result there does not refresh a new scope. Current success requires valid presentation context, matching request/query/scope and owner receipt. Thrown delivery requires explicit read-only review, never automatic retry. Actual pending Build navigation, scope-delayed acceptance, displaced outer/nested delivery, native busy replacement, successful V14 replacement, and retained owner/UI profile/recovery tests cover their named boundaries.

Corrective PlanDecision/Sleep handlers retain their actual return contracts and persistence retry behavior. No publication-style receipt is fabricated for them. Omission remains generation evidence and an interval-free historical plan, not a skipped Actual. Sleep remains continuous and fully protected. Native 8 uses actual quota failure for ordinary PlanDecision save retry; Sleep uses its existing atomic accept/revoke contract.

## Evidence strength

`ReviewCertaintyWorkflow` has 61 tests: real durable-adapter fault cases, real delayed/after-admission commands, and explicitly labelled typed consumer-delivery seams. The latter intentionally construct result variants using owner receipt constructors to isolate presentation; they do not substitute for storage/authority assertions. The accepted owner suites, actual new fault cases, native IndexedDB seams, and physical readbacks provide that separate evidence. No permanent authority assertions or timeouts were weakened.
