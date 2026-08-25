import { describe, expect, it } from "vitest";
import {
  createDayFrameBackupV6,
  translateBackupV5ToV6,
  validateDayFrameBackupV6,
} from "./dayFrameBackupV6.js";
import { createDayFrameBackupV5 } from "./dayFrameBackupV5.js";
import { createDayFrameBackupV4 } from "./dayFrameBackupV4.js";
import { createDayFrameBackupV3 } from "./dayFrameBackupV3.js";
import { createInitialDayFrameState } from "./createInitialDayFrameState.js";
const emptyV3 = () =>
  createDayFrameBackupV3(
    {
      active: { surfaceVersion: 2, data: createInitialDayFrameState() },
      profiles: { surfaceVersion: 2, profiles: [], quarantinedProfiles: [] },
      planDecisions: { surfaceVersion: 1, decisions: [], quarantinedDecisions: [] },
      executionHistory: {
        app: "DayFrame",
        surface: "executionHistory",
        version: 1,
        records: [],
        quarantinedComponents: [],
      },
      historicalPlan: { surfaceVersion: 1, batches: [] },
    },
    "2026-08-23T00:00:00.000Z",
  );
describe("Backup V6", () => {
  it("adds canonical empty observations to V5", () => {
    const v4 = createDayFrameBackupV4(
        { ...emptyV3().data, goals: { version: 1, goals: [] } },
        "2026-08-23T00:00:00.000Z",
      ),
      v5 = createDayFrameBackupV5(
        { ...v4.data, measurementDefinitions: { version: 1, definitions: [] } },
        v4.exportedAt,
      );
    expect(translateBackupV5ToV6(v5).data.progressObservations).toEqual({
      version: 1,
      observations: [],
    });
    expect(
      validateDayFrameBackupV6(
        createDayFrameBackupV6(
          { ...v5.data, progressObservations: { version: 1, observations: [] } },
          v5.exportedAt,
        ),
      ).version,
    ).toBe(6);
  });
  it("roundtrips mixed HistoricalPlan V1/V2 timing provenance without an envelope bump", () => {
    const v4 = createDayFrameBackupV4(
        { ...emptyV3().data, goals: { version: 1, goals: [] } },
        "2026-08-23T00:00:00.000Z",
      ),
      v5 = createDayFrameBackupV5(
        { ...v4.data, measurementDefinitions: { version: 1, definitions: [] } },
        v4.exportedAt,
      ),
      base = createDayFrameBackupV6(
        { ...v5.data, progressObservations: { version: 1, observations: [] } },
        v5.exportedAt,
      );
    const occurrence = {
      reference: {
        version: 1,
        sourceKind: "manualEvent",
        manualEvent: { id: "event", incarnationId: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" },
      },
      sourceFamily: "manualEvent",
      title: "Event",
      category: "optional",
      plan: {
        state: "scheduled",
        startsAt: "2026-08-20T13:00:00.000Z",
        endsAt: "2026-08-20T14:00:00.000Z",
      },
    };
    const mixed = {
      ...base,
      data: {
        ...base.data,
        historicalPlan: {
          surfaceVersion: 1,
          batches: [
            {
              surfaceVersion: 1,
              version: 1,
              id: "11111111-1111-4111-8111-111111111111",
              publishedAt: "2026-08-20T10:00:00.000Z",
              range: { startUserDayDate: "2026-08-20", endUserDayDate: "2026-08-20" },
              days: [
                {
                  version: 1,
                  userDayDate: "2026-08-20",
                  dayBoundaryStartTime: "03:00",
                  weekStartsOn: "monday",
                  utcOffsetMinutes: -300,
                  occurrences: [
                    { version: 1, ...occurrence },
                    {
                      version: 2,
                      ...occurrence,
                      reference: {
                        ...occurrence.reference,
                        manualEvent: { ...occurrence.reference.manualEvent, id: "event-2" },
                      },
                      timing: { kind: "allDay" },
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    };
    const restored = validateDayFrameBackupV6(JSON.parse(JSON.stringify(mixed)));
    expect(restored.version).toBe(6);
    expect(restored.data.historicalPlan.batches[0]!.days[0]!.occurrences).toEqual(
      expect.arrayContaining([
        { version: 1, ...occurrence },
        {
          version: 2,
          ...occurrence,
          reference: {
            ...occurrence.reference,
            manualEvent: { ...occurrence.reference.manualEvent, id: "event-2" },
          },
          timing: { kind: "allDay" },
        },
      ]),
    );
  });
});
