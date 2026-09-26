/** Process-local completion identity. Never part of durable authority or snapshots. */
export type PublicationReceipt = Readonly<{ isCurrent: () => boolean }>;

export function withPublicationReceipt<T extends object>(
  value: T,
  receipt: PublicationReceipt,
): T & { readonly receipt: PublicationReceipt } {
  // Keep existing outcome payloads/serialization stable; consumers access the receipt explicitly.
  return Object.defineProperty(value, "receipt", { value: receipt }) as T & {
    readonly receipt: PublicationReceipt;
  };
}
