import { IDBFactory, IDBKeyRange } from "fake-indexeddb";
import { describe, expect, it } from "vitest";
import { createIndexedDbCollectionStorage, type DurableDatabaseSchema } from "./indexedDbCollectionStorage.js";

const schema = (name: string, version = 1): DurableDatabaseSchema => ({ name, version, stores: [
  { name: "items", keyPath: "id", indexes: [
    { name: "byDay", keyPath: "day" }, { name: "byDayAndTime", keyPath: ["day", "time"] },
    { name: "uniqueSlug", keyPath: "slug", unique: true },
  ] },
  { name: "metadata", keyPath: "key" },
] });
let databaseNumber = 0;
const nextName = () => `dayframe-storage-test-${databaseNumber++}`;

describe("IndexedDB durable collection storage", () => {
  it("puts, gets, deletes, clears, and preserves structured-clone isolation", async () => {
    const storage = createIndexedDbCollectionStorage({ schema: schema(nextName()), indexedDB: new IDBFactory() });
    const input = { id: "a", slug: "a", day: "2026-08-20", time: "09:00", nested: { value: 1 } };
    expect(await storage.put("items", input)).toEqual({ status: "success", value: undefined });
    input.nested.value = 9;
    const read = await storage.get<typeof input>("items", "a");
    expect(read).toMatchObject({ status: "success", value: { nested: { value: 1 } } });
    if (read.status === "success" && read.value) read.value.nested.value = 7;
    expect(await storage.get<typeof input>("items", "a")).toMatchObject({ value: { nested: { value: 1 } } });
    expect(await storage.delete("items", "a")).toEqual({ status: "success", value: undefined });
    expect(await storage.get("items", "a")).toEqual({ status: "success", value: undefined });
    await storage.putMany("items", [{ id: "b", slug: "b", day: "2026-08-20", time: "10:00" },
      { id: "c", slug: "c", day: "2026-08-20", time: "11:00" }]);
    expect(await storage.clear("items")).toEqual({ status: "success", value: undefined });
    expect(await storage.getAll("items")).toEqual({ status: "success", value: [] });
  });

  it("commits multi-store mixed batches atomically", async () => {
    const storage = createIndexedDbCollectionStorage({ schema: schema(nextName()), indexedDB: new IDBFactory() });
    const result = await storage.mutate([
      { type: "put", store: "items", value: { id: "a", slug: "a", day: "2026-08-20", time: "09:00" } },
      { type: "put", store: "metadata", value: { key: "checkpoint", value: 1 } },
    ]);
    expect(result.status).toBe("success");
    expect(await storage.get("items", "a")).toMatchObject({ status: "success", value: { id: "a" } });
    expect(await storage.get("metadata", "checkpoint")).toMatchObject({ status: "success", value: { value: 1 } });
  });

  it("reports constraint abort only after terminal transaction failure and leaves no partial writes", async () => {
    const storage = createIndexedDbCollectionStorage({ schema: schema(nextName()), indexedDB: new IDBFactory() });
    const result = await storage.putMany("items", [
      { id: "a", slug: "duplicate", day: "2026-08-20", time: "09:00" },
      { id: "b", slug: "duplicate", day: "2026-08-20", time: "10:00" },
    ]);
    expect(result).toMatchObject({ status: "failure", error: { code: "constraintViolation" } });
    expect(await storage.getAll("items")).toEqual({ status: "success", value: [] });
  });

  it("normalizes structured-clone failure without a partial commit", async () => {
    const storage = createIndexedDbCollectionStorage({ schema: schema(nextName()), indexedDB: new IDBFactory() });
    const result = await storage.putMany("items", [
      { id: "a", slug: "a", day: "2026-08-20", time: "09:00" },
      { id: "bad", slug: "bad", day: "2026-08-20", time: "10:00", invalid: () => undefined },
    ]);
    expect(result).toMatchObject({ status: "failure", error: { code: "cloneFailure" } });
    expect(await storage.getAll("items")).toEqual({ status: "success", value: [] });
  });

  it("normalizes quota-like write failure", async () => {
    const storage = createIndexedDbCollectionStorage({ schema: schema(nextName()), indexedDB: new IDBFactory() });
    const value = { id: "a", get payload(): unknown { throw new DOMException("quota", "QuotaExceededError"); } };
    expect(await storage.put("items", value)).toMatchObject({ status: "failure", error: { code: "quotaExceeded" } });
    expect(await storage.getAll("items")).toEqual({ status: "success", value: [] });
  });

  it("supports equality, bounded compound ranges, and reverse limited queries", async () => {
    const storage = createIndexedDbCollectionStorage({ schema: schema(nextName()), indexedDB: new IDBFactory() });
    await storage.putMany("items", [
      { id: "a", slug: "a", day: "2026-08-20", time: "09:00" },
      { id: "b", slug: "b", day: "2026-08-20", time: "12:00" },
      { id: "c", slug: "c", day: "2026-08-21", time: "08:00" },
    ]);
    expect(await storage.queryIndex<{ id: string }>({ store: "items", index: "byDay", query: "2026-08-20" }))
      .toMatchObject({ status: "success", value: [{ id: "a" }, { id: "b" }] });
    expect(await storage.queryIndex<{ id: string }>({ store: "items", index: "byDayAndTime",
      query: IDBKeyRange.bound(["2026-08-20", "10:00"], ["2026-08-21", "08:00"]), direction: "prev", limit: 2 }))
      .toMatchObject({ status: "success", value: [{ id: "c" }, { id: "b" }] });
  });

  it("upgrades additively, preserves data, and closes stale connections on versionchange", async () => {
    const factory = new IDBFactory(); const name = nextName(); let versionChanged = false;
    const first = createIndexedDbCollectionStorage({ schema: { name, version: 1, stores: [{ name: "items", keyPath: "id" }] },
      indexedDB: factory, onVersionChange: () => { versionChanged = true; } });
    await first.put("items", { id: "a", day: "2026-08-20" });
    const second = createIndexedDbCollectionStorage({ schema: { name, version: 2, stores: [
      { name: "items", keyPath: "id", indexes: [{ name: "byDay", keyPath: "day" }] },
      { name: "metadata", keyPath: "key" },
    ] }, indexedDB: factory });
    expect((await second.open()).status).toBe("success");
    expect(versionChanged).toBe(true);
    expect(await second.get("items", "a")).toMatchObject({ status: "success", value: { id: "a" } });
    expect(await second.queryIndex({ store: "items", index: "byDay", query: "2026-08-20" }))
      .toMatchObject({ status: "success", value: [{ id: "a" }] });
  });

  it("aborts an invalid upgrade without destroying the prior database", async () => {
    const factory = new IDBFactory(); const name = nextName();
    const first = createIndexedDbCollectionStorage({ schema: { name, version: 1, stores: [{ name: "items", keyPath: "id" }] }, indexedDB: factory });
    await first.put("items", { id: "kept" }); first.close();
    const invalidUpgrade = createIndexedDbCollectionStorage({ schema: { name, version: 2, stores: [
      { name: "items", keyPath: "id", indexes: [{ name: "invalid", keyPath: ["a", "b"], multiEntry: true }] },
    ] }, indexedDB: factory });
    expect((await invalidUpgrade.open()).status).toBe("failure");
    const reopened = createIndexedDbCollectionStorage({ schema: { name, version: 1, stores: [{ name: "items", keyPath: "id" }] }, indexedDB: factory });
    expect(await reopened.get("items", "kept")).toMatchObject({ status: "success", value: { id: "kept" } });
  });

  it("closes/reopens explicitly and deletes the database", async () => {
    const storage = createIndexedDbCollectionStorage({ schema: schema(nextName()), indexedDB: new IDBFactory() });
    await storage.put("items", { id: "a", slug: "a", day: "2026-08-20", time: "09:00" });
    storage.close();
    expect(await storage.get("items", "a")).toMatchObject({ status: "success", value: { id: "a" } });
    expect(await storage.deleteDatabase()).toEqual({ status: "success", value: undefined });
    expect(await storage.getAll("items")).toEqual({ status: "success", value: [] });
  });

  it("reports a blocked upgrade instead of hanging", async () => {
    const factory = new IDBFactory(); const name = nextName();
    const blocker = await new Promise<IDBDatabase>((resolve, reject) => { const request = factory.open(name, 1);
      request.onupgradeneeded = () => request.result.createObjectStore("items", { keyPath: "id" });
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
    let blocked = false;
    const storage = createIndexedDbCollectionStorage({ schema: { name, version: 2, stores: [{ name: "items", keyPath: "id" }] },
      indexedDB: factory, onBlocked: () => { blocked = true; } });
    expect(await storage.open()).toEqual({ status: "failure", error: { code: "upgradeBlocked", operation: "open" } });
    expect(blocked).toBe(true); blocker.close();
  });

  it("normalizes open failures and remains import/construction safe", async () => {
    let opens = 0;
    const factory = { open: () => { opens += 1; throw new DOMException("blocked", "SecurityError"); } } as unknown as IDBFactory;
    const storage = createIndexedDbCollectionStorage({ schema: schema(nextName()), indexedDB: factory });
    expect(opens).toBe(0);
    expect(await storage.open()).toMatchObject({ status: "failure", error: { code: "openFailed", name: "SecurityError" } });
  });

});
