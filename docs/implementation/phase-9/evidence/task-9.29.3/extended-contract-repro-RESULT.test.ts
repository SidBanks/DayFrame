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
  PROPOSAL_AUTHORITY_STORE,
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
async function prepared(multiRole = false) {
  const f = await start();
  if (multiRole) {
    const spec = await f.store.createDemandResourceFootprintSpec({
      name: "Required full footprint",
      variants: [
        {
          id: "study",
          name: "Study",
          components: [
            {
              id: "notes",
              role: "supportActivity",
              scope: "perSession",
              requiredness: "required",
              durationMinutes: 30,
              geometry: { kind: "startsAtProductiveEnd" },
              actor: "user",
              source: { kind: "direct" },
            },
            {
              id: "buffer",
              role: "bufferProtection",
              scope: "perSession",
              requiredness: "required",
              durationMinutes: 15,
              target: { kind: "supportComponent", componentId: "notes" },
              side: "after",
              source: { kind: "direct" },
            },
          ],
        },
      ],
    });
    if (spec.status !== "accepted") throw Error(JSON.stringify(spec));
    expect(
      (
        await f.store.setDemandResourceFootprintAssociation({
          demandId: f.demandId,
          expectedRevision: 1,
          selection: {
            kind: "specification",
            specificationId: spec.value.id,
            specificationRevision: spec.value.revision,
            variantId: "study",
            selectedOptionalComponentIds: [],
          },
        })
      ).status,
    ).toBe("accepted");
  }
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

it.each(["clear", "restore"] as const)(
  "independent earlier Proposal commit gap: %s",
  async (replacement) => {
    const { store, durable, input } = await prepared();
    const backup = await store.exportBackupV14(at);
    if (backup.status !== "exported") throw Error(backup.status);
    const entered = deferred(),
      release = deferred(),
      real = durable.mutate;
    let attempts = 0,
      transactions = 0,
      suppliedAdmission = false;
    let originalRows: unknown[] = [];
    vi.spyOn(durable, "mutate").mockImplementation(
      async (rows, admit, observe) => {
        const acceptanceWrite = rows.some(
          (row) =>
            row.type === "put" &&
            row.store === PROPOSAL_AUTHORITY_STORE &&
            (row.value as { recordType?: string }).recordType ===
              "acceptedAllocation",
        );
        if (acceptanceWrite) {
          attempts++;
          originalRows = structuredClone(rows);
          suppliedAdmission = !!admit;
          entered.resolve();
          await release.promise;
        }
        return real(rows, admit, (receipt) => {
          if (acceptanceWrite) transactions++;
          observe?.(receipt);
        });
      },
    );
    const pending = store.acceptProposalOption(input);
    await entered.promise;
    expect(attempts).toBe(1);
    expect(transactions).toBe(0);
    expect(store.exportProposalAuthority().acceptedAllocations).toEqual([]);
    const controller = getDayFrameRuntimeAuthorityController(
      store,
      DAYFRAME_RUNTIME_AUTHORITY_CAPABILITY,
    );
    const beforeEpoch = controller.getEpoch();
    const replacementResult =
      replacement === "clear"
        ? await store.clearLocalData()
        : await store.importBackupV14(backup.backup);
    expect(replacementResult.status).toBe(
      replacement === "clear" ? "cleared" : "restoredV14",
    );
    const beforeRelease = {
      proposals: store.exportProposalAuthority(),
      realizations: store.exportRealizationAuthority(),
      physical: await durable.getAll(PROPOSAL_AUTHORITY_STORE),
    };
    expect(beforeRelease.proposals.acceptedAllocations).toEqual([]);
    release.resolve();
    const late = await pending;
    expect(late.status).toBe("accepted");
    expect(store.exportProposalAuthority().acceptedAllocations).toHaveLength(1);
    expect(transactions).toBe(1);
    expect(suppliedAdmission).toBe(false);
    const physical = await durable.getAll(PROPOSAL_AUTHORITY_STORE);
    if (physical.status !== "success") throw Error("readback");
    for (const row of originalRows as Array<{
      type: string;
      value?: { recordType: string; id: string; revision?: number };
    }>) {
      if (row.type === "put")
        expect(
          physical.value.find(
            (v) =>
              (v as typeof row.value)?.recordType === row.value!.recordType &&
              (v as typeof row.value)?.id === row.value!.id &&
              (v as typeof row.value)?.revision === row.value!.revision,
          ),
        ).toEqual(row.value);
    }
    const reopened = createDayFrameDurableDb();
    expect(await reopened.getAll(PROPOSAL_AUTHORITY_STORE)).toEqual(physical);
    writeFileSync(
      new URL(
        `./proposal-commit-${replacement}-observations-RESULT.json`,
        import.meta.url,
      ),
      JSON.stringify(
        {
          classification:
            "demonstrated independent earlier Proposal persistence gap",
          replacement,
          beforeEpoch,
          afterEpoch: controller.getEpoch(),
          attempts,
          transactions,
          suppliedAdmission,
          originalRows,
          beforeRelease,
          replacementResult,
          late,
          physical,
          runtime: store.exportProposalAuthority(),
          realizations: store.exportRealizationAuthority(),
        },
        null,
        2,
      ) + "\n",
    );
  },
);
it("multi-role canonical healthy realization preserves exact required claims", async () => {
  const { store, durable, input } = await prepared(true);
  const outcome = await store.acceptProposalOption(input);
  expect(outcome.status).toBe("accepted");
  const accepted = store.exportProposalAuthority().acceptedAllocations[0]!;
  const authority = store.exportRealizationAuthority();
  expect(authority.facts.map((f) => f.scheduleRole).sort()).toEqual([
    "bufferProtection",
    "productiveGoalWork",
    "supportActivity",
  ]);
  expect(authority.realizations).toHaveLength(1);
  for (const fact of authority.facts) {
    const claim = accepted.claims.find(
      (c) => c.id === fact.origin.acceptedClaimId,
    )!;
    expect(fact.startsAt).toBe(claim.startsAt);
    expect(fact.endsAt).toBe(claim.endsAt);
    expect(fact.userDayDate).toBe(claim.userDayDate);
  }
  const physical = await durable.getAll(REALIZATION_AUTHORITY_STORE);
  expect(physical.status === "success" && physical.value.length).toBe(4);
  const restarted = createDayFrameStore(undefined, {
    restoreIndexedDb: createDayFrameDurableDb(),
  });
  await restarted.whenReady();
  expect(restarted.getRealizationIngressStatus()).toBe("ready");
  for (const fact of authority.facts)
    expect(
      restarted.listRealizedScheduleFacts().find((f) => f.id === fact.id),
    ).toEqual(fact);
  writeFileSync(
    new URL("./multi-role-control-observations-RESULT.json", import.meta.url),
    JSON.stringify(
      {
        accepted,
        authority,
        outcome,
        physical,
        restarted: restarted.exportRealizationAuthority(),
      },
      null,
      2,
    ) + "\n",
  );
});
it("same acceptance automatic plus concurrent retry creates two physical transactions today", async () => {
  const { store, durable, input } = await prepared();
  const real = durable.mutate;
  const entered = deferred(),
    release = deferred();
  let attempts = 0,
    transactions = 0;
  vi.spyOn(durable, "mutate").mockImplementation(
    async (rows, admit, observe) => {
      const realization = rows.some(
        (row) =>
          row.type === "put" && row.store === REALIZATION_AUTHORITY_STORE,
      );
      if (realization) {
        attempts++;
        if (attempts === 1) {
          entered.resolve();
          await release.promise;
        }
      }
      return real(rows, admit, (receipt) => {
        if (realization) transactions++;
        observe?.(receipt);
      });
    },
  );
  const automatic = store.acceptProposalOption(input);
  await entered.promise;
  const accepted = store.exportProposalAuthority().acceptedAllocations[0]!;
  const retry = await store.realizeAcceptedAllocation(accepted.id);
  expect(retry.status).toBe("realized");
  release.resolve();
  const outer = await automatic;
  expect(outer.status).toBe("accepted");
  expect(attempts).toBe(2);
  expect(transactions).toBe(2);
  expect(store.listRealizedScheduleFacts()).toHaveLength(1);
  writeFileSync(
    new URL(
      "./same-acceptance-concurrency-observations-RESULT.json",
      import.meta.url,
    ),
    JSON.stringify(
      {
        accepted,
        attempts,
        transactions,
        retry,
        outer,
        authority: store.exportRealizationAuthority(),
      },
      null,
      2,
    ) + "\n",
  );
});
