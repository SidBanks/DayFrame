import { describe, expect, it, vi } from "vitest";
import { createDayFrameAuthorityTransaction } from "./dayFrameAuthorityTransaction.js";
import { createDayFrameNotificationScheduler } from "./dayFrameNotificationScheduler.js";

describe("observable authority transaction", () => {
  it("deduplicates notifications and exposes all installed state before flush", () => {
    const scheduler = createDayFrameNotificationScheduler(); let left = 1; let right = 2;
    const observed: number[][] = [];
    const transaction = createDayFrameAuthorityTransaction({ scheduler, participants: [
      { id: "left", capture: () => left, installExact: (value) => { left = value as number; } },
      { id: "right", capture: () => right, installExact: (value) => { right = value as number; } },
    ] });
    expect(transaction.begin("internalReplacement").status).toBe("begun");
    left = 3; right = 4;
    scheduler.notify("main", () => observed.push([left, right]));
    scheduler.notify("main", () => observed.push([left, right]));
    expect(observed).toEqual([]);
    expect(transaction.commit()).toEqual({ status: "committed" });
    expect(observed).toEqual([[3, 4]]);
  });

  it("restores a clone-isolated snapshot without leaking notifications", () => {
    const scheduler = createDayFrameNotificationScheduler(); const listener = vi.fn();
    let value = { items: ["old"] };
    const transaction = createDayFrameAuthorityTransaction({ scheduler, participants: [{
      id: "value", capture: () => value, installExact: (next) => { value = next as typeof value; },
    }] });
    transaction.begin("restore"); value.items.push("target"); scheduler.notify("main", listener);
    expect(transaction.abort()).toEqual({ status: "aborted" });
    expect(value).toEqual({ items: ["old"] }); expect(listener).not.toHaveBeenCalled();
  });

  it("rejects nested transactions", () => {
    const scheduler = createDayFrameNotificationScheduler();
    const transaction = createDayFrameAuthorityTransaction({ scheduler, participants: [] });
    expect(transaction.begin("bootstrap").status).toBe("begun");
    expect(transaction.begin("restore")).toEqual({ status: "busy" });
  });
});
