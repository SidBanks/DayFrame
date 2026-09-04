import type { DayFrameRuntimeAuthorityController } from "../../state/dayFrameRuntimeAuthority.js";
import type {
  RestoreParticipantAdapter,
  CombinedIndexedDbRestoreAdapter,
  ExecutionHistoryAntiResurrectionAdapter,
} from "./restoreParticipants.js";
import { assertRestoreParticipants } from "./restoreParticipants.js";
import { createRestoreTransactionId, type RestoreTransactionId } from "./restoreIdentity.js";
import type { RestoreJournalV1, RestoreMode, RestoreStage } from "./restoreJournal.js";
import {
  wholeFingerprint,
  type RestoreFingerprints,
  type RestoreLocalStageV1,
  type RestoreParticipantId,
  type RestorePayloadSet,
} from "./restoreStaging.js";

export type RestoreCoordinatorStatus =
  | "idle"
  | "preparing"
  | "staging"
  | "committing"
  | "recovering"
  | "finalizing"
  | "recoveryRequired";
export type RestoreResult =
  | { status: "completed" }
  | {
      status:
        | "busy"
        | "participantNotReady"
        | "participantProtected"
        | "invalidTarget"
        | "stagingFailed"
        | "sourceChanged"
        | "indexedDbCommitFailed"
        | "indexedDbVerificationFailed"
        | "localStorageCommitFailed"
        | "verificationFailed"
        | "rolledBack"
        | "rollbackFailed"
        | "recoveryRequired";
      participantId?: RestoreParticipantId;
    };
export type StartupRecoveryResult = {
  status:
    | "noRecoveryNeeded"
    | "resumedForward"
    | "rolledBack"
    | "finalizedCleanup"
    | "recoveryRequired";
};

export function createRestorePreBootstrapHook(coordinator: {
  recoverAtStartup(): Promise<StartupRecoveryResult>;
}) {
  return async (): Promise<
    { status: "continue" } | { status: "protected"; reason: "authorityRecoveryRequired" }
  > => {
    const result = await coordinator.recoverAtStartup();
    return result.status === "recoveryRequired"
      ? { status: "protected", reason: "authorityRecoveryRequired" }
      : { status: "continue" };
  };
}

type JournalStorage = {
  read():
    | { status: "absent" }
    | { status: "present"; journal: RestoreJournalV1 }
    | { status: "failure"; reason: string };
  write(value: RestoreJournalV1): { status: "success" } | { status: "failure"; reason: string };
  clear(id: RestoreTransactionId): { status: "success" } | { status: "failure"; reason: string };
};
type DurableStage = {
  stage(
    id: RestoreTransactionId,
    target: RestorePayloadSet,
    recovery: RestorePayloadSet,
    sourceFingerprints: RestoreFingerprints,
    targetFingerprints: RestoreFingerprints,
    recoveryFingerprints: RestoreFingerprints,
  ): Promise<unknown>;
  read(id: RestoreTransactionId): Promise<
    | {
        status: "success";
        target: RestorePayloadSet;
        recovery: RestorePayloadSet;
        metadata: {
          targetFingerprint: string;
          recoveryFingerprint: string;
          sourceFingerprints?: RestoreFingerprints;
        };
      }
    | { status: "failure"; reason: string }
  >;
  cleanup(id: RestoreTransactionId): Promise<{ status: string }>;
};
type LocalStage = {
  write(value: RestoreLocalStageV1): { status: string };
  read(): unknown;
  cleanup(id: RestoreTransactionId): { status: string };
};

export function createRestoreCoordinator(options: {
  participants: readonly RestoreParticipantAdapter[];
  combinedIndexedDb: CombinedIndexedDbRestoreAdapter;
  runtime: DayFrameRuntimeAuthorityController;
  antiResurrection: ExecutionHistoryAntiResurrectionAdapter;
  journal: JournalStorage;
  durableStage: DurableStage;
  localStage: LocalStage;
  allocateId?: () => string;
  now?: () => string;
}) {
  assertRestoreParticipants(options.participants);
  let status: RestoreCoordinatorStatus = "idle";
  const byId = Object.fromEntries(options.participants.map((value) => [value.id, value])) as Record<
    RestoreParticipantId,
    RestoreParticipantAdapter
  >;
  const now = options.now ?? (() => new Date().toISOString());

  async function restore(
    targetInput: Record<string, unknown>,
    mode: RestoreMode = "ordinary",
  ): Promise<RestoreResult> {
    if (status !== "idle" || options.runtime.getState().status !== "inactive")
      return { status: "busy" };
    status = "preparing";
    const begun = options.runtime.begin("restore");
    if (begun.status !== "begun") {
      status = "idle";
      return { status: "busy" };
    }
    const precondition = checkReadiness(mode);
    if (precondition) return stop(precondition);
    const target = validateTargets(targetInput);
    if (target.status === "failure") return stop(target.result);
    const prospectiveRuntime = await translateTargets(target.value);
    if (prospectiveRuntime.status === "failure")
      return stop({ status: "invalidTarget", participantId: prospectiveRuntime.participantId });
    let recovery: RestorePayloadSet;
    try {
      recovery = Object.fromEntries(
        await Promise.all(
          options.participants.map(async (participant) => [
            participant.id,
            participant.clonePayload(await participant.captureCurrentAuthority()),
          ]),
        ),
      ) as RestorePayloadSet;
    } catch {
      return stop({ status: "stagingFailed" });
    }
    const source = await captureSources();
    const targetPrints = adapterFingerprints(target.value);
    const recoveryPrints = adapterFingerprints(recovery);
    const transactionId = createRestoreTransactionId(options.allocateId);
    let journal = makeJournal(
      transactionId,
      mode,
      "prepared",
      wholeFingerprint(targetPrints),
      wholeFingerprint(recoveryPrints),
    );
    if (options.journal.write(journal).status !== "success")
      return stop({ status: "stagingFailed" });
    status = "staging";
    const staged = await options.durableStage.stage(
      transactionId,
      target.value,
      recovery,
      source,
      targetPrints,
      recoveryPrints,
    );
    if (
      !successful(staged) ||
      options.localStage.write(
        localEnvelope(transactionId, target.value, recovery, targetPrints, recoveryPrints),
      ).status !== "success"
    )
      return stop({ status: "stagingFailed" }, transactionId);
    const reread = await options.durableStage.read(transactionId);
    if (reread.status !== "success" || !validStaged(reread, journal))
      return stop({ status: "stagingFailed" }, transactionId);
    if (!(await recheckSources(source))) return stop({ status: "sourceChanged" }, transactionId);
    journal = transition(journal, "staged");
    if (options.journal.write(journal).status !== "success") return protect();
    return commitTarget(journal, target.value, recovery, false);
  }

  async function recoverAtStartup(): Promise<StartupRecoveryResult> {
    const found = options.journal.read();
    if (found.status === "absent") return { status: "noRecoveryNeeded" };
    if (found.status === "failure" || status !== "idle") {
      status = "recoveryRequired";
      return { status: "recoveryRequired" };
    }
    status = "recovering";
    const journal = found.journal;
    const staged = await options.durableStage.read(journal.transactionId);
    if (journal.stage === "prepared" && staged.status === "failure") {
      await cleanup(journal.transactionId);
      status = "idle";
      return { status: "finalizedCleanup" };
    }
    if (staged.status !== "success" || !validStaged(staged, journal)) {
      status = "recoveryRequired";
      return { status: "recoveryRequired" };
    }
    if (journal.stage === "recoveryRequired") {
      status = "recoveryRequired";
      return { status: "recoveryRequired" };
    }
    const begun = options.runtime.begin("restore");
    if (begun.status !== "begun") {
      status = "recoveryRequired";
      return { status: "recoveryRequired" };
    }
    if (journal.stage.startsWith("rollback")) {
      const rolled = await rollback(journal, staged.recovery);
      return { status: rolled.status === "rolledBack" ? "rolledBack" : "recoveryRequired" };
    }
    if (journal.stage === "prepared" || journal.stage === "staged") {
      if (
        !staged.metadata.sourceFingerprints ||
        !(await recheckSources(staged.metadata.sourceFingerprints))
      ) {
        options.runtime.abort();
        status = "recoveryRequired";
        return { status: "recoveryRequired" };
      }
    }
    if (journal.stage === "finalized") {
      options.runtime.abort();
      const cleaned = await cleanup(journal.transactionId);
      status = cleaned ? "idle" : "recoveryRequired";
      return { status: cleaned ? "finalizedCleanup" : "recoveryRequired" };
    }
    const result = await commitTarget(journal, staged.target, staged.recovery, true);
    return {
      status:
        result.status === "completed"
          ? "resumedForward"
          : result.status === "rolledBack"
            ? "rolledBack"
            : "recoveryRequired",
    };
  }

  async function commitTarget(
    initial: RestoreJournalV1,
    target: RestorePayloadSet,
    recovery: RestorePayloadSet,
    resumed: boolean,
  ): Promise<RestoreResult> {
    status = resumed ? "recovering" : "committing";
    let journal = initial;
    if (journal.stage === "prepared") {
      journal = transition(journal, "staged");
      if (options.journal.write(journal).status !== "success") return protect();
    }
    if (journal.stage === "staged") {
      const written = await options.combinedIndexedDb.replaceExact(indexedPayload(target));
      if (written.status === "failure") {
        options.runtime.abort();
        await cleanup(journal.transactionId);
        status = "idle";
        return { status: "indexedDbCommitFailed" };
      }
      const verified = await options.combinedIndexedDb.verifyExact(indexedPayload(target));
      if (verified.status === "failure") return rollback(journal, recovery);
      journal = transition(journal, "indexedDbCommitted");
      if (options.journal.write(journal).status !== "success") return protect();
    }
    if (journal.stage === "indexedDbCommitted") {
      const local = await writeAndVerifyLocal(target);
      if (!local) {
        const retried = await writeAndVerifyLocal(target);
        if (!retried) return rollback(journal, recovery);
      }
      if (
        (await options.antiResurrection.writeExact(target.executionHistory)).status === "failure" ||
        (await options.antiResurrection.verifyExact(target.executionHistory)).status === "failure"
      )
        return rollback(journal, recovery);
      journal = transition(journal, "localStorageCommitted");
      if (options.journal.write(journal).status !== "success") return protect();
    }
    if (journal.stage === "localStorageCommitted") {
      if (!(await verifyAll(target))) return rollback(journal, recovery);
      if (!(await installRuntime(target))) return protect();
      journal = transition(journal, "verified");
      if (options.journal.write(journal).status !== "success") return protect();
    }
    if (journal.stage === "verified") {
      journal = transition(journal, "finalized");
      if (options.journal.write(journal).status !== "success") return protect();
    }
    status = "finalizing";
    await cleanup(journal.transactionId);
    status = "idle";
    return { status: "completed" };
  }

  async function rollback(
    initial: RestoreJournalV1,
    recovery: RestorePayloadSet,
  ): Promise<RestoreResult> {
    let journal = initial;
    const rollbackFailure = (): RestoreResult => {
      const recoveryRequired = transition(journal, "recoveryRequired");
      options.journal.write(recoveryRequired);
      return protect("rollbackFailed");
    };
    if (!journal.stage.startsWith("rollback")) {
      journal = transition(journal, "rollbackPrepared");
      if (options.journal.write(journal).status !== "success") return rollbackFailure();
    }
    if (journal.stage === "rollbackPrepared") {
      if (
        (await options.combinedIndexedDb.replaceExact(indexedPayload(recovery))).status ===
        "failure"
      )
        return rollbackFailure();
      journal = transition(journal, "rollbackIndexedDbCommitted");
      if (options.journal.write(journal).status !== "success") return rollbackFailure();
    }
    if (journal.stage === "rollbackIndexedDbCommitted") {
      if (!(await writeAndVerifyLocal(recovery))) return rollbackFailure();
      if (
        (await options.antiResurrection.writeExact(recovery.executionHistory)).status ===
          "failure" ||
        (await options.antiResurrection.verifyExact(recovery.executionHistory)).status === "failure"
      )
        return rollbackFailure();
      journal = transition(journal, "rollbackLocalStorageCommitted");
      if (options.journal.write(journal).status !== "success") return rollbackFailure();
    }
    if (!(await verifyAll(recovery)) || !(await installRuntime(recovery))) return rollbackFailure();
    journal = transition(journal, "rollbackVerified");
    if (options.journal.write(journal).status !== "success") return rollbackFailure();
    journal = transition(journal, "finalized");
    if (options.journal.write(journal).status !== "success") return rollbackFailure();
    await cleanup(journal.transactionId);
    status = "idle";
    return { status: "rolledBack" };
  }

  function validateTargets(input: Record<string, unknown>) {
    const output = {} as RestorePayloadSet;
    for (const participant of options.participants) {
      const checked = participant.validatePayload(input[participant.id]);
      if (checked.status === "invalid")
        return {
          status: "failure" as const,
          result: { status: "invalidTarget" as const, participantId: participant.id },
        };
      output[participant.id] = participant.clonePayload(checked.payload);
    }
    return { status: "success" as const, value: output };
  }
  function checkReadiness(mode: RestoreMode): RestoreResult | undefined {
    for (const participant of options.participants) {
      const readiness = participant.getReadiness();
      if (readiness === "protected" && mode !== "recoveryReplacement")
        return { status: "participantProtected", participantId: participant.id };
      if (readiness !== "ready" && !(mode === "recoveryReplacement" && readiness === "protected"))
        return { status: "participantNotReady", participantId: participant.id };
    }
  }
  async function captureSources() {
    return Object.fromEntries(
      await Promise.all(
        options.participants.map(async (value) => [
          value.id,
          await value.captureSourceFingerprint(),
        ]),
      ),
    ) as Record<RestoreParticipantId, string>;
  }
  async function recheckSources(source: Record<RestoreParticipantId, string>) {
    for (const participant of options.participants)
      if ((await participant.recheckSourceFingerprint(source[participant.id])).status === "failure")
        return false;
    return true;
  }
  async function writeAndVerifyLocal(payload: RestorePayloadSet) {
    for (const id of ["active", "profiles", "planDecisions"] as const) {
      if (
        (await byId[id].writeDurableTargetExact(payload[id])).status === "failure" ||
        (await byId[id].verifyDurableTarget(payload[id])).status === "failure"
      )
        return false;
    }
    return true;
  }
  async function verifyAll(payload: RestorePayloadSet) {
    if ((await options.combinedIndexedDb.verifyExact(indexedPayload(payload))).status === "failure")
      return false;
    if ((await options.antiResurrection.verifyExact(payload.executionHistory)).status === "failure")
      return false;
    for (const participant of options.participants.filter(
      (value) => value.durableKind === "localStorage",
    ))
      if ((await participant.verifyDurableTarget(payload[participant.id])).status === "failure")
        return false;
    return true;
  }
  async function translateTargets(payload: RestorePayloadSet) {
    const targets: Partial<Record<RestoreParticipantId, unknown>> = {};
    for (const participant of options.participants) {
      const translated = await participant.buildRuntimeTargetFromDurable(
        participant.clonePayload(payload[participant.id]),
      );
      if (translated.status === "invalid")
        return { status: "failure" as const, participantId: participant.id };
      targets[participant.id] = structuredClone(translated.target);
    }
    return {
      status: "success" as const,
      targets: targets as Record<RestoreParticipantId, unknown>,
    };
  }
  async function installRuntime(payload: RestorePayloadSet) {
    const translated = await translateTargets(payload);
    if (translated.status === "failure") {
      options.runtime.abort();
      return false;
    }
    for (const participant of options.participants) {
      const installed = options.runtime.install(
        participant.id,
        structuredClone(translated.targets[participant.id]),
      );
      if (installed.status !== "installed") {
        options.runtime.abort();
        return false;
      }
    }
    return options.runtime.commit().status === "committed";
  }
  function adapterFingerprints(payload: RestorePayloadSet) {
    return Object.fromEntries(
      options.participants.map((participant) => [
        participant.id,
        participant.fingerprint(payload[participant.id]),
      ]),
    ) as RestoreFingerprints;
  }
  function validStaged(
    staged: {
      target: RestorePayloadSet;
      recovery: RestorePayloadSet;
      metadata: { targetFingerprint: string; recoveryFingerprint: string };
    },
    journal: RestoreJournalV1,
  ) {
    try {
      for (const participant of options.participants) {
        if (
          participant.validatePayload(staged.target[participant.id]).status !== "valid" ||
          participant.validatePayload(staged.recovery[participant.id]).status !== "valid"
        )
          return false;
      }
      return (
        staged.metadata.targetFingerprint === journal.targetFingerprint &&
        staged.metadata.recoveryFingerprint === journal.recoveryFingerprint &&
        wholeFingerprint(adapterFingerprints(staged.target)) === journal.targetFingerprint &&
        wholeFingerprint(adapterFingerprints(staged.recovery)) === journal.recoveryFingerprint
      );
    } catch {
      return false;
    }
  }
  function stop(result: RestoreResult, id?: RestoreTransactionId): RestoreResult {
    options.runtime.abort();
    if (id) void cleanup(id);
    status = "idle";
    return result;
  }
  function protect(
    result: "recoveryRequired" | "rollbackFailed" = "recoveryRequired",
  ): RestoreResult {
    options.runtime.abort();
    status = "recoveryRequired";
    return { status: result };
  }
  async function cleanup(id: RestoreTransactionId) {
    const durable = await options.durableStage.cleanup(id);
    if (durable.status !== "success") return false;
    if (options.localStage.cleanup(id).status !== "success") return false;
    return options.journal.clear(id).status === "success";
  }
  function getStatus() {
    return status;
  }
  return { restore, recoverAtStartup, getStatus };

  function makeJournal(
    id: RestoreTransactionId,
    mode: RestoreMode,
    stage: RestoreStage,
    targetFingerprint: string,
    recoveryFingerprint: string,
  ): RestoreJournalV1 {
    const timestamp = now();
    return {
      app: "DayFrame",
      surface: "restore-journal",
      version: 1,
      transactionId: id,
      stage,
      mode,
      targetFingerprint,
      recoveryFingerprint,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  }
  function transition(value: RestoreJournalV1, stage: RestoreStage): RestoreJournalV1 {
    return { ...value, stage, updatedAt: now() };
  }
}

function indexedPayload(payload: RestorePayloadSet) {
  return {
    executionHistory: payload.executionHistory,
    historicalPlan: payload.historicalPlan,
    goals: payload.goals,
    measurementDefinitions: payload.measurementDefinitions,
    progressObservations: payload.progressObservations,
    goalStructure: payload.goalStructure,
    goalPlanning: payload.goalPlanning,
    composition: payload.composition,
  };
}
function successful(value: unknown): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    (value as { status: string }).status === "success"
  );
}
function localEnvelope(
  id: RestoreTransactionId,
  target: RestorePayloadSet,
  recovery: RestorePayloadSet,
  targetFingerprints: RestoreFingerprints,
  recoveryFingerprints: RestoreFingerprints,
): RestoreLocalStageV1 {
  return {
    app: "DayFrame",
    surface: "restore-local-stage",
    version: 1,
    transactionId: id,
    target: {
      active: structuredClone(target.active),
      profiles: structuredClone(target.profiles),
      planDecisions: structuredClone(target.planDecisions),
    },
    recovery: {
      active: structuredClone(recovery.active),
      profiles: structuredClone(recovery.profiles),
      planDecisions: structuredClone(recovery.planDecisions),
    },
    targetFingerprints: {
      active: targetFingerprints.active,
      profiles: targetFingerprints.profiles,
      planDecisions: targetFingerprints.planDecisions,
    },
    recoveryFingerprints: {
      active: recoveryFingerprints.active,
      profiles: recoveryFingerprints.profiles,
      planDecisions: recoveryFingerprints.planDecisions,
    },
  };
}
