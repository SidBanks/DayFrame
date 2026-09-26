import { createSourceObservation } from "./sourceObservation.js";
/** Lightweight process-local shell shared by a lazy façade and its concrete owner. */
export type AcceptanceOrigin = Readonly<{ isCurrent(): boolean; desiredVersion?: number }>;
export type AcceptanceReceipt = AcceptanceOrigin;
export type AcceptanceAdmission = "replacementBusy" | "authorityUnavailable" | "authorityProtected";
export type AcceptanceLifecycle = ReturnType<typeof createAcceptanceLifecycle>;
const receipts = new WeakSet<object>();

export function hasCurrentAcceptanceReceipt(value: unknown): boolean {
  if (!value || typeof value !== "object" || !("receipt" in value)) return false;
  const receipt = value.receipt;
  return (
    !!receipt &&
    typeof receipt === "object" &&
    receipts.has(receipt) &&
    (receipt as AcceptanceReceipt).isCurrent()
  );
}

export function createAcceptanceLifecycle() {
  const observation = createSourceObservation();
  let generation = 0;
  let desiredVersion = 0;
  let active: AcceptanceOrigin | undefined;
  let entering: AcceptanceOrigin | undefined;
  let getEpoch = () => 0;
  let peerGeneration = () => 0;
  let admission: () => AcceptanceAdmission | undefined = () => undefined;
  let coordinatorCurrent: (epoch: number) => boolean = () => false;
  let canInstall = () => true;
  let replacement:
    | (<T>(run: (epoch: number) => Promise<T>) => Promise<T | { status: "failure" }>)
    | undefined;
  const issued = new WeakSet<object>();
  function capture(parent?: AcceptanceOrigin): AcceptanceOrigin {
    const epoch = getEpoch(),
      own = generation,
      peer = peerGeneration();
    const origin = Object.freeze({
      desiredVersion,
      isCurrent: () =>
        own === generation &&
        peer === peerGeneration() &&
        epoch === getEpoch() &&
        (!parent || parent.isCurrent()),
    });
    issued.add(origin);
    return origin;
  }
  function current(origin: AcceptanceOrigin) {
    return issued.has(origin) && origin.isCurrent();
  }
  function result<T extends object>(
    value: T,
    origin: AcceptanceOrigin,
  ): T & { readonly receipt: AcceptanceReceipt } {
    const receipt = Object.freeze({ isCurrent: () => current(origin) });
    receipts.add(receipt);
    return Object.defineProperty(value, "receipt", { value: receipt }) as T & {
      readonly receipt: AcceptanceReceipt;
    };
  }
  return {
    observation,
    capture,
    current,
    result,
    origin: () => entering ?? capture(),
    // The context is synchronous dispatch only. Async owners retain their own local origin.
    enter<T>(origin: AcceptanceOrigin, invoke: () => T): T {
      if (!issued.has(origin)) throw new Error("Unrecognized operation origin");
      const previous = entering;
      entering = origin;
      try {
        return invoke();
      } finally {
        entering = previous;
      }
    },
    acquire(origin: AcceptanceOrigin) {
      if (!current(origin)) return "contextReplaced" as const;
      const denied = admission();
      if (denied) return denied;
      if (active) return "busy" as const;
      active = origin;
      observation.changed();
    },
    release(origin: AcceptanceOrigin) {
      if (active === origin) {
        active = undefined;
        observation.changed();
      }
    },
    owns: (origin: AcceptanceOrigin) => active === origin && current(origin),
    active: () => active,
    admission: () => admission(),
    isQuiescent: () => !active,
    generation: () => generation,
    desiredVersion: () => desiredVersion,
    supersedeDesired: () => {
      desiredVersion++;
      observation.changed();
    },
    invalidate: () => {
      generation++;
      observation.changed();
    },
    coordinatorCurrent: (epoch: number) => coordinatorCurrent(epoch),
    assertInstall() {
      if (active || !canInstall())
        throw new Error("Runtime installation requires quiescent coordinator authority");
    },
    configure(value: {
      getEpoch: () => number;
      peerGeneration: () => number;
      admission: () => AcceptanceAdmission | undefined;
      coordinatorCurrent: (epoch: number) => boolean;
      canInstall: () => boolean;
      replace: <T>(run: (epoch: number) => Promise<T>) => Promise<T | { status: "failure" }>;
    }) {
      getEpoch = value.getEpoch;
      peerGeneration = value.peerGeneration;
      admission = value.admission;
      coordinatorCurrent = value.coordinatorCurrent;
      canInstall = value.canInstall;
      replacement = value.replace;
    },
    async replace<T>(run: (epoch?: number) => Promise<T>): Promise<T | { status: "failure" }> {
      if (active || admission()) return { status: "failure" };
      if (replacement) return replacement(run);
      const origin = capture();
      active = origin;
      observation.changed();
      generation++;
      observation.changed();
      try {
        return await run();
      } finally {
        if (active === origin) {
          active = undefined;
          observation.changed();
        }
      }
    },
  };
}
