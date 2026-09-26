import type {
  DurableMutation,
  DurableTransactionReceipt,
  IndexedDbCollectionStorage,
} from "../infrastructure/storage/indexedDbCollectionStorage.js";

/** Physical completion is required even when the adapter's outward promise is lost. */
export async function persistAcceptanceMutation(
  storage: IndexedDbCollectionStorage,
  mutations: DurableMutation[],
  admit: () => boolean,
): Promise<"committed" | "notWritten" | "uncertain"> {
  let open = true;
  const receipts: DurableTransactionReceipt[] = [];
  let lost!: () => void;
  const missing = new Promise<never>((_, reject) => {
    lost = () => reject(new Error("Missing transaction acknowledgment"));
  });
  try {
    const acknowledgment = await Promise.race([
      storage.mutate(
        mutations,
        () => open && admit(),
        (receipt) => {
          receipts.push(receipt);
          void receipt.terminal.then(() => {
            const channel = new MessageChannel();
            channel.port1.onmessage = () => {
              channel.port1.close();
              channel.port2.close();
              lost();
            };
            channel.port2.postMessage(null);
          });
        },
      ),
      missing,
    ]);
    open = false;
    const terminal = await Promise.all(receipts.map((r) => r.terminal));
    if (terminal.includes("aborted")) return "notWritten";
    if (acknowledgment.status === "failure")
      return terminal.includes("committed") ? "uncertain" : "notWritten";
    // Supported adapters register their native transaction before enqueuing requests.
    return terminal.length === 1 && terminal[0] === "committed" ? "committed" : "uncertain";
  } catch {
    open = false;
    const terminal = await Promise.all(receipts.map((r) => r.terminal));
    return terminal.length === 0 || terminal.every((value) => value === "aborted")
      ? "notWritten"
      : "uncertain";
  }
}

/** Only top-level collection order is unspecified; nested payloads remain exact. */
export function exactAuthorityRows(left: readonly unknown[], right: readonly unknown[]) {
  const order = (rows: readonly unknown[]) => rows.map((row) => JSON.stringify(row)).sort();
  return JSON.stringify(order(left)) === JSON.stringify(order(right));
}

export async function captureAcceptanceProtectionEvidence(
  storage: IndexedDbCollectionStorage,
  store: string,
  attempted: unknown,
) {
  try {
    return {
      attempted: structuredClone(attempted),
      observed: await storage.getAll<unknown>(store),
    };
  } catch {
    return { attempted: structuredClone(attempted), observed: { status: "unavailable" as const } };
  }
}
export type AcceptanceProtectionEvidence = Awaited<
  ReturnType<typeof captureAcceptanceProtectionEvidence>
>;
