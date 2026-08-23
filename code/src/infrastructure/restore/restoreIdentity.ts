export type RestoreTransactionId = string & { readonly __restoreTransactionId: unique symbol };

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export function isRestoreTransactionId(value: unknown): value is RestoreTransactionId {
  return typeof value === "string" && UUID_V4.test(value);
}

export function createRestoreTransactionId(
  allocate: () => string = () => globalThis.crypto.randomUUID(),
): RestoreTransactionId {
  const value = allocate();
  if (!isRestoreTransactionId(value)) throw new Error("Restore transaction allocator returned a non-canonical UUID-v4.");
  return value;
}
