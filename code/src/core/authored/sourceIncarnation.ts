export type SourceIncarnationId = string & { readonly __sourceIncarnationId: unique symbol };

export type IncarnatedSource = {
  incarnationId: SourceIncarnationId;
};

const CANONICAL_UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

export type SourceIncarnationAllocator = () => SourceIncarnationId;

export function isSourceIncarnationId(value: unknown): value is SourceIncarnationId {
  return typeof value === "string" && CANONICAL_UUID_V4.test(value);
}

export function createSourceIncarnationId(): SourceIncarnationId {
  const randomUUID = globalThis.crypto?.randomUUID;

  if (!randomUUID) {
    throw new Error("Cryptographic UUID generation is unavailable.");
  }

  const value = randomUUID.call(globalThis.crypto);
  if (!isSourceIncarnationId(value)) {
    throw new Error("Cryptographic UUID generation returned a noncanonical UUID v4.");
  }
  return value;
}
