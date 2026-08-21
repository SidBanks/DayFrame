export type AllocateReadableSourceIdInput = {
  prefix: string;
  occupiedIds: Iterable<string>;
  numericPadding?: number;
  preferredId?: string;
};

export function allocateReadableSourceId(input: AllocateReadableSourceIdInput): string {
  const occupiedIds = new Set(input.occupiedIds);

  if (input.preferredId !== undefined) {
    if (!occupiedIds.has(input.preferredId)) {
      return input.preferredId;
    }

    let suffix = 2;
    let candidate = `${input.preferredId}_${suffix}`;

    while (occupiedIds.has(candidate)) {
      suffix += 1;
      candidate = `${input.preferredId}_${suffix}`;
    }

    return candidate;
  }

  const escapedPrefix = input.prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const recognizedIdPattern = new RegExp(`^${escapedPrefix}(\\d+)$`);
  let nextSuffix = 1;

  for (const occupiedId of occupiedIds) {
    const match = recognizedIdPattern.exec(occupiedId);

    if (match) {
      nextSuffix = Math.max(nextSuffix, Number(match[1]) + 1);
    }
  }

  const numericPadding = input.numericPadding ?? 0;
  let candidate = `${input.prefix}${String(nextSuffix).padStart(numericPadding, "0")}`;

  while (occupiedIds.has(candidate)) {
    nextSuffix += 1;
    candidate = `${input.prefix}${String(nextSuffix).padStart(numericPadding, "0")}`;
  }

  return candidate;
}
