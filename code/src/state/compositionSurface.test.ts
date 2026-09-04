import { IDBFactory } from "fake-indexeddb";
import { describe, expect, it } from "vitest";
import type { SourceIncarnationId } from "../core/authored/sourceIncarnation.js";
import type { CompositionTemplateSourceV1 } from "../core/planning/commitmentComposition.js";
import { createDayFrameDurableDb } from "../infrastructure/storage/dayFrameDurableDb.js";
import { createCompositionSurface } from "./compositionSurface.js";

const parentInc = "11111111-1111-4111-8111-111111111111" as SourceIncarnationId,
  childInc = "22222222-2222-4222-8222-222222222222" as SourceIncarnationId;
const sources: CompositionTemplateSourceV1[] = [
  source("parent", parentInc),
  source("child", childInc),
];
function source(sourceId: string, incarnationId: SourceIncarnationId): CompositionTemplateSourceV1 {
  return {
    kind: "template",
    sourceId,
    incarnationId,
    title: sourceId,
    durationMinutes: 30,
    revisionToken: "r1",
    userId: "u",
    category: "maintenance",
    priority: 3,
  };
}
const input = {
  parent: { kind: "template" as const, sourceId: "parent", incarnationId: parentInc },
  child: { kind: "template" as const, sourceId: "child", incarnationId: childInc },
  slot: "before",
  order: 0,
  applicability: {},
  requiredness: "required" as const,
  timing: { kind: "endsAtParentStart" as const },
  timingStrictness: "constraint" as const,
  buffer: { beforeMinutes: 0, afterMinutes: 0 },
  goalSupport: "none" as const,
};

describe("Composition surface", () => {
  it("persists semantic revisions, preserves exact history, and does not revise no-ops", async () => {
    const storage = createDayFrameDurableDb({
      indexedDB: new IDBFactory(),
      name: "composition-surface",
    });
    const ids = ["aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb"],
      times = ["2026-09-04T12:00:00.000Z", "2026-09-04T13:00:00.000Z"];
    const create = () =>
      createCompositionSurface({
        storage,
        listSources: () => sources,
        allocateId: () => ids.shift() as never,
        now: () => times[0]!,
      });
    const surface = create();
    expect(await surface.initializeComposition()).toEqual({ status: "ready" });
    const created = await surface.createAttachment(input);
    expect(created).toMatchObject({ status: "accepted", value: { revision: 1 } });
    if (created.status !== "accepted") return;
    expect(
      await surface.reviseAttachment(created.value.id, 1, { requiredness: "required" }),
    ).toMatchObject({ status: "accepted", changed: false, value: { revision: 1 } });
    times.shift();
    expect(
      await surface.reviseAttachment(created.value.id, 1, { requiredness: "optional" }),
    ).toMatchObject({ status: "accepted", changed: true, value: { revision: 2 } });
    expect(surface.getAttachmentRevision(created.value.id, 1)).toMatchObject({
      status: "resolved",
      relationship: { requiredness: "required" },
    });
    const restarted = create();
    expect(await restarted.initializeComposition()).toEqual({ status: "ready" });
    expect(restarted.exportCompositionAuthority().relationships).toHaveLength(2);
  });
  it("rejects invalid endpoint authority atomically", async () => {
    const surface = createCompositionSurface({
      storage: createDayFrameDurableDb({
        indexedDB: new IDBFactory(),
        name: "composition-invalid",
      }),
      listSources: () => sources,
      allocateId: () => "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" as never,
    });
    await surface.initializeComposition();
    expect(
      await surface.createAttachment({ ...input, child: { ...input.child, sourceId: "missing" } }),
    ).toMatchObject({ status: "rejected", reason: "invalidInput" });
    expect(surface.exportCompositionAuthority().relationships).toEqual([]);
  });
  it("invalidates current derived previews after accepted authority changes", async () => {
    let changes = 0;
    const surface = createCompositionSurface({
      storage: createDayFrameDurableDb({
        indexedDB: new IDBFactory(),
        name: "composition-freshness",
      }),
      listSources: () => sources,
      allocateId: () => "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa" as never,
      onAuthorityChanged: () => (changes += 1),
    });
    await surface.initializeComposition();
    await surface.createAttachment(input);
    expect(changes).toBe(1);
  });
});
