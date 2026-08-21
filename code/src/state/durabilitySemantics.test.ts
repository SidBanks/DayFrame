import { describe, expect, it } from "vitest";

import {
  classifyClearLocalDataResult,
  classifyActivePersistenceOutcome,
  classifyActiveStoreMutationResult,
  classifyDurabilityRetryResult,
  classifyPersistenceRemovalOutcome,
  classifyPersistenceWriteOutcome,
  classifyStoreDurabilityStatus,
  classifyStoreMutationResult,
  classifySurfaceDurabilityStatus,
} from "./durabilitySemantics.js";
import { createInitialDayFrameState } from "./createInitialDayFrameState.js";
import type { ClearLocalDataResult, DurabilityRetryResult } from "./types.js";

describe("durability semantics", () => {
  it.each([
    ["persisted", "durableSuccess"],
    ["unavailable", "retryableUnavailable"],
    ["storageFailure", "retryableStorageFailure"],
    ["serializationFailure", "recoveryRequired"],
  ] as const)("classifies write outcome %s as %s", (status, expected) => {
    expect(classifyPersistenceWriteOutcome({ status })).toBe(expected);
  });

  it.each([
    ["removed", "durableSuccess"],
    ["unavailable", "retryableUnavailable"],
    ["storageFailure", "retryableStorageFailure"],
  ] as const)("classifies removal outcome %s as %s", (status, expected) => {
    expect(classifyPersistenceRemovalOutcome({ status })).toBe(expected);
  });

  it.each([
    ["unknown", "internalNoOp"],
    ["durable", "durableSuccess"],
    ["unavailable", "retryableUnavailable"],
    ["storageFailure", "retryableStorageFailure"],
    ["serializationFailure", "recoveryRequired"],
  ] as const)("classifies retained status %s as %s", (status, expected) => {
    expect(classifySurfaceDurabilityStatus(status)).toBe(expected);
  });

  it.each([
    [
      { status: "attempted", desiredCondition: "snapshot", persistence: { status: "persisted" } },
      "durableSuccess",
    ],
    [
      {
        status: "attempted",
        desiredCondition: "snapshot",
        persistence: { status: "unavailable" },
      },
      "retryableUnavailable",
    ],
    [
      {
        status: "attempted",
        desiredCondition: "snapshot",
        persistence: { status: "storageFailure" },
      },
      "retryableStorageFailure",
    ],
    [
      {
        status: "attempted",
        desiredCondition: "snapshot",
        persistence: { status: "serializationFailure" },
      },
      "recoveryRequired",
    ],
    [
      { status: "attempted", desiredCondition: "absent", persistence: { status: "removed" } },
      "durableSuccess",
    ],
    [
      {
        status: "attempted",
        desiredCondition: "absent",
        persistence: { status: "unavailable" },
      },
      "retryableUnavailable",
    ],
    [
      {
        status: "attempted",
        desiredCondition: "absent",
        persistence: { status: "storageFailure" },
      },
      "retryableStorageFailure",
    ],
    [{ status: "notAttempted", reason: "alreadyDurable" }, "durableSuccess"],
    [{ status: "notAttempted", reason: "unknown" }, "internalNoOp"],
    [{ status: "notAttempted", reason: "serializationFailure" }, "recoveryRequired"],
    [{ status: "notAttempted", reason: "recoveryProtected" }, "internalNoOp"],
  ] as const)("classifies retry result %# as %s", (result, expected) => {
    expect(classifyDurabilityRetryResult(result)).toBe(expected);
  });

  it.each([
    [
      {
        activeState: { status: "removed" },
        profiles: { status: "removed" },
        durability: "cleared",
      },
      { aggregate: "durableSuccess", activeState: "durableSuccess", profiles: "durableSuccess" },
    ],
    [
      {
        activeState: { status: "removed" },
        profiles: { status: "unavailable" },
        durability: "partiallyCleared",
      },
      {
        aggregate: "partialDurabilityFailure",
        activeState: "durableSuccess",
        profiles: "retryableUnavailable",
      },
    ],
    [
      {
        activeState: { status: "blocked", reason: "activeLocalRecovery" },
        profiles: { status: "removed" },
        durability: "partiallyCleared",
      },
      {
        aggregate: "partialDurabilityFailure",
        activeState: "internalNoOp",
        profiles: "durableSuccess",
      },
    ],
    [
      {
        activeState: { status: "storageFailure" },
        profiles: { status: "removed" },
        durability: "partiallyCleared",
      },
      {
        aggregate: "partialDurabilityFailure",
        activeState: "retryableStorageFailure",
        profiles: "durableSuccess",
      },
    ],
    [
      {
        activeState: { status: "unavailable" },
        profiles: { status: "storageFailure" },
        durability: "notCleared",
      },
      {
        aggregate: "durabilityFailure",
        activeState: "retryableUnavailable",
        profiles: "retryableStorageFailure",
      },
    ],
  ] as const)("classifies structured clear result %#", (input, expected) => {
    const result: ClearLocalDataResult = {
      state: createInitialDayFrameState(),
      planDecisions: { status: "removed" },
      ...input,
    };

    expect(classifyClearLocalDataResult(result)).toEqual({
      ...expected,
      planDecisions: "durableSuccess",
    });
  });

  it("classifies store mutation and two-surface retained status through shared mappings", () => {
    const state = createInitialDayFrameState();

    expect(classifyStoreMutationResult({ state, persistence: { status: "storageFailure" } })).toBe(
      "retryableStorageFailure",
    );
    expect(
      classifyStoreDurabilityStatus({
        activeState: "serializationFailure",
        profiles: "unknown",
      }),
    ).toEqual({ activeState: "recoveryRequired", profiles: "internalNoOp" });
  });

  it("classifies active recovery protection as a non-attempt", () => {
    const state = createInitialDayFrameState();

    expect(
      classifyActivePersistenceOutcome({
        status: "blocked",
        reason: "activeLocalRecovery",
      }),
    ).toBe("internalNoOp");
    expect(
      classifyActiveStoreMutationResult({
        state,
        persistence: { status: "blocked", reason: "activeLocalRecovery" },
      }),
    ).toBe("internalNoOp");
  });

  it("does not mutate input objects", () => {
    const retryResult: DurabilityRetryResult = {
      status: "attempted",
      desiredCondition: "snapshot",
      persistence: { status: "storageFailure" },
    };
    const before = structuredClone(retryResult);

    classifyDurabilityRetryResult(retryResult);

    expect(retryResult).toEqual(before);
  });
});
