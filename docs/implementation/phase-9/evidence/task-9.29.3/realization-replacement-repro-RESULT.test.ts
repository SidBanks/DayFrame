import { writeFileSync } from "node:fs";
import {
  beforeEach,
  afterEach,
  expect,
  it,
  vi,
} from "../../../../../code/node_modules/vitest/dist/index.js";
import { IDBFactory } from "../../../../../code/node_modules/fake-indexeddb/build/esm/index.js";
import { createDayFrameStore } from "../../../../../code/src/state/dayFrameStore.js";
import {
  createDayFrameDurableDb,
  REALIZATION_AUTHORITY_STORE,
} from "../../../../../code/src/infrastructure/storage/dayFrameDurableDb.js";
import type { DayFrameStore } from "../../../../../code/src/state/types.js";
import type { SleepRequirementIntentV1 } from "../../../../../code/src/core/sleep/sleepRequirement.js";
import {
  DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
  getDayFrameRuntimeAuthorityController,
} from "../../../../../code/src/state/dayFrameRuntimeAuthority.js";
// Defect-confirming diagnostic, intentionally outside the permanent suite.
// Supporting setup derives a real allocation and Proposal from saved Goal/Demand/Sleep.
class MemoryStorage implements Storage {
  values = new Map<string, string>();
  get length() {
    return this.values.size;
  }
  key(i: number) {
    return [...this.values.keys()][i] ?? null;
  }
  getItem(k: string) {
    return this.values.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    this.values.set(k, v);
  }
  removeItem(k: string) {
    this.values.delete(k);
  }
  clear() {
    this.values.clear();
  }
}
let storage: MemoryStorage;
beforeEach(() => {
  storage = new MemoryStorage();
  vi.stubGlobal("localStorage", storage);
  vi.stubGlobal("indexedDB", new IDBFactory());
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-09-16T12:00:00.000Z"));
});
const range = {
  startUserDayDate: "2026-09-17",
  endUserDayDateExclusive: "2026-09-18",
} as const;
const at = "2026-09-16T12:00:00.000Z";
function author(
  store: DayFrameStore,
  patch: Partial<SleepRequirementIntentV1> = {},
) {
  const head = store.getState().sleepRequirements?.at(-1);
  const result = store.authorSleepRequirement({
    id: "sleep",
    expectedRevision: head?.revision ?? null,
    ...(head ? { expectedIncarnationId: head.incarnationId } : {}),
    recordedAt: at,
    intent: {
      enabled: true,
      effectiveFrom: "2026-09-01",
      weekdays: "all",
      durationMinutes: 120,
      bufferBeforeMinutes: 0,
      bufferAfterMinutes: 0,
      window: { kind: "clock", startClock: "00:00", endClock: "02:00" },
      ...patch,
    },
  });
  expect(result.status).toBe("authored");
  return result;
}
async function start() {
  const durable = createDayFrameDurableDb();
  const store = createDayFrameStore(undefined, { restoreIndexedDb: durable });
  await store.whenReady();
  store.setSchedulingPreferences({
    dayBoundaryStartTime: "00:00",
    weekStartsOn: "monday",
  });
  author(store);
  const goal = await store.createGoal({ title: "Study" });
  if (goal.status !== "accepted") throw new Error("goal");
  const demand = await store.createDemand({
    goalId: goal.goal.id,
    requestedEffort: { unit: "minutes", amount: 60 },
    horizon: { kind: "userDayInterval", ...range },
    session: { mode: "indivisible", exactMinutes: 60 },
    satisfaction: { kind: "minimum", allowPartial: false },
    cadence: { kind: "total" },
  });
  if (demand.status !== "accepted") throw new Error("demand");
  await store.setDemandResourceFootprintAssociation({
    demandId: demand.value.id,
    selection: { kind: "productiveOnly" },
  });
  return { store, durable, demandId: demand.value.id };
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}
async function prepared() {
  const f = await start();
  const evaluated = await f.store.evaluateCompetingAllocation({
    ...range,
    evaluationCutoff: at,
  });
  if (evaluated.status !== "evaluated") throw Error(JSON.stringify(evaluated));
  const generated = await f.store.deriveProposal({
    allocation: evaluated.allocation.allocations[0]!,
    horizon: range,
    allocationHorizon: range,
    generatedAt: at,
    evaluationCutoff: at,
  });
  if (generated.status !== "proposed") throw Error(JSON.stringify(generated));
  expect((await f.store.recordProposal(generated)).status).toBe("accepted");
  return {
    ...f,
    input: {
      proposalId: generated.proposal.id,
      proposalRevision: generated.proposal.revision,
      optionId: generated.proposal.preferredOptionId,
    },
  };
}
it("control: the canonical Proposal accepts and automatically realizes without replacement", async () => {
  const { store, input } = await prepared();
  const result = await store.acceptProposalOption(input);
  expect(result.status).toBe("accepted");
  expect(store.exportProposalAuthority().acceptedAllocations).toHaveLength(1);
  expect(store.listRealizedScheduleFacts()).toHaveLength(1);
});
for (const command of [
  "acceptAutomaticRealization",
  "explicitRealizationRetry",
] as const) {
  it.each(["clear", "restore"] as const)(
    `${command}: old physical realization resumes after successful %s`,
    async (replacement) => {
      const { store, durable, input } = await prepared();
      // Snapshot before acceptance: incoming authority intentionally has no acceptance or realization.
      const backup = await store.exportBackupV14(at);
      if (backup.status !== "exported") throw Error(backup.status);
      expect(backup.backup.data.realizations.facts).toEqual([]);
      expect(backup.backup.data.proposals.acceptedAllocations).toEqual([]);
      const nativeMutate = durable.mutate;
      if (command === "explicitRealizationRetry") {
        const fail = vi
          .spyOn(durable, "mutate")
          .mockImplementation((rows, admit, observe) =>
            nativeMutate(
              rows,
              rows.some(
                (row) =>
                  row.type === "put" &&
                  row.store === REALIZATION_AUTHORITY_STORE,
              )
                ? () => false
                : admit,
              observe,
            ),
          );
        const acceptance = await store.acceptProposalOption(input);
        expect(acceptance.status).toBe("accepted");
        expect(
          store.exportProposalAuthority().acceptedAllocations,
        ).toHaveLength(1);
        expect(store.listRealizedScheduleFacts()).toEqual([]);
        fail.mockRestore();
      }
      const entered = deferred(),
        release = deferred();
      let attempts = 0,
        createdTransactions = 0,
        suppliedAdmission = false;
      let exactAttemptedRows: unknown[] = [];
      vi.spyOn(durable, "mutate").mockImplementation(
        async (rows, admit, observe) => {
          const realization = rows.some(
            (row) =>
              row.type === "put" && row.store === REALIZATION_AUTHORITY_STORE,
          );
          if (realization) {
            attempts++;
            suppliedAdmission = typeof admit === "function";
            exactAttemptedRows = structuredClone(rows);
            entered.resolve();
            await release.promise;
          }
          return nativeMutate(rows, admit, (receipt) => {
            if (realization) createdTransactions++;
            observe?.(receipt);
          });
        },
      );
      const pending =
        command === "acceptAutomaticRealization"
          ? store.acceptProposalOption(input)
          : store.realizeAcceptedAllocation(
              store.exportProposalAuthority().acceptedAllocations[0]!.id,
            );
      await entered.promise;
      expect(attempts).toBe(1);
      expect(createdTransactions).toBe(0);
      const controller = getDayFrameRuntimeAuthorityController(
        store,
        DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
      );
      const epochBefore = controller.getEpoch();
      const priorAccepted = store.exportProposalAuthority().acceptedAllocations;
      expect(priorAccepted).toHaveLength(1);
      const replaced =
        replacement === "clear"
          ? await store.clearLocalData()
          : await store.importBackupV14(backup.backup);
      expect(replaced.status).toBe(
        replacement === "clear" ? "cleared" : "restoredV14",
      );
      const epochAfter = controller.getEpoch();
      expect(epochAfter).toBeGreaterThan(epochBefore);
      expect(store.exportProposalAuthority().acceptedAllocations).toEqual([]);
      expect(store.listRealizedScheduleFacts()).toEqual([]);
      const immediatelyAfter = await durable.getAll(
        REALIZATION_AUTHORITY_STORE,
      );
      expect(immediatelyAfter).toEqual({ status: "success", value: [] });
      release.resolve();
      const late = await pending;
      expect(late.status).toBe(
        command === "acceptAutomaticRealization" ? "accepted" : "realized",
      );
      expect(attempts).toBe(1);
      expect(createdTransactions).toBe(1);
      expect(suppliedAdmission).toBe(false);
      const returnedRuntime = store.exportRealizationAuthority();
      expect(returnedRuntime.realizations).toHaveLength(1);
      expect(returnedRuntime.facts).toHaveLength(1);
      expect(returnedRuntime.realizations[0]!.acceptedAllocationId).toBe(
        priorAccepted[0]!.id,
      );
      expect(store.exportProposalAuthority().acceptedAllocations).toEqual([]);
      const physical = await durable.getAll(REALIZATION_AUTHORITY_STORE);
      expect(physical.status).toBe("success");
      if (physical.status !== "success") throw Error("readback");
      expect(physical.value).toHaveLength(2);
      for (const row of exactAttemptedRows as Array<{
        type: string;
        value: { id: string };
      }>) {
        expect(row.type).toBe("put");
        expect(
          physical.value.find(
            (value) => (value as { id: string }).id === row.value.id,
          ),
        ).toEqual(row.value);
      }
      expect(returnedRuntime.realizations[0]).toEqual(
        (exactAttemptedRows[0] as { value: unknown }).value,
      );
      expect(returnedRuntime.facts[0]).toEqual(
        (exactAttemptedRows[1] as { value: unknown }).value,
      );
      // Independently reopen only after replacement and the old operation have settled.
      const reopened = createDayFrameDurableDb();
      expect(await reopened.getAll(REALIZATION_AUTHORITY_STORE)).toEqual(
        physical,
      );
      const restarted = createDayFrameStore({}, { restoreIndexedDb: reopened });
      await restarted.whenReady();
      expect(restarted.getRealizationIngressStatus()).toBe("protected");
      expect(await reopened.getAll(REALIZATION_AUTHORITY_STORE)).toEqual(
        physical,
      );
      const observation = {
        diagnostic: "defect-confirming, not repaired behavior",
        command,
        replacement,
        attempts,
        createdTransactions,
        suppliedAdmission,
        epochBefore,
        epochAfter,
        priorAccepted,
        exactAttemptedRows,
        replacementResult: replaced,
        immediatelyAfter,
        late,
        returnedRuntime,
        physical,
        restartedRealizationIngress: restarted.getRealizationIngressStatus(),
        restartedReadiness: restarted.getReadiness(),
      };
      writeFileSync(
        new URL(
          `./${command}-${replacement}-observations-RESULT.json`,
          import.meta.url,
        ),
        JSON.stringify(observation, null, 2) + "\n",
      );
    },
  );
}
