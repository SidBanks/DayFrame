export function createLazySurface<T extends object>(
  keys: string[],
  load: () => Promise<T>,
  sync: Record<string, unknown> = {},
): T {
  return new Proxy(
    {},
    {
      ownKeys: () => keys,
      getOwnPropertyDescriptor: () => ({ enumerable: true, configurable: true }),
      get: (_target, key: PropertyKey) =>
        typeof key === "string" && key in sync
          ? sync[key]
          : (...args: unknown[]) =>
              load().then((surface) =>
                (surface[key as keyof T] as (...values: unknown[]) => unknown)(...args),
              ),
    },
  ) as T;
}
