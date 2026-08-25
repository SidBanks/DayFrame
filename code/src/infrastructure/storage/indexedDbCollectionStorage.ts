export const DAYFRAME_DURABLE_DB_NAME = "dayframe-durable-v1";
export const DAYFRAME_DURABLE_DB_VERSION = 6;

export type DurableStorageErrorCode =
  | "unavailable"
  | "openFailed"
  | "upgradeBlocked"
  | "versionError"
  | "transactionAborted"
  | "constraintViolation"
  | "quotaExceeded"
  | "cloneFailure"
  | "readFailed"
  | "writeFailed"
  | "deleteFailed"
  | "unknown";
export type DurableStorageError = {
  code: DurableStorageErrorCode;
  operation: string;
  name?: string;
};
export type DurableStorageResult<T> =
  | { status: "success"; value: T }
  | { status: "failure"; error: DurableStorageError };

export type DurableIndexSchema = {
  name: string;
  keyPath: string | string[];
  unique?: boolean;
  multiEntry?: boolean;
};
export type DurableStoreSchema = {
  name: string;
  keyPath?: string | string[];
  autoIncrement?: boolean;
  indexes?: readonly DurableIndexSchema[];
};
export type DurableDatabaseSchema = {
  name: string;
  version: number;
  stores: readonly DurableStoreSchema[];
};

export type DurableMutation =
  | { type: "put"; store: string; value: unknown; key?: IDBValidKey }
  | { type: "delete"; store: string; key: IDBValidKey }
  | { type: "clear"; store: string };
export type DurableIndexQuery = {
  store: string;
  index: string;
  query?: IDBValidKey | IDBKeyRange;
  direction?: IDBCursorDirection;
  limit?: number;
};

export type IndexedDbCollectionStorage = ReturnType<typeof createIndexedDbCollectionStorage>;

export function createIndexedDbCollectionStorage(options: {
  schema: DurableDatabaseSchema;
  indexedDB?: IDBFactory | undefined;
  onBlocked?: (() => void) | undefined;
  onVersionChange?: (() => void) | undefined;
}) {
  const factory = options.indexedDB ?? globalThis.indexedDB;
  let connection: IDBDatabase | undefined;
  let opening: Promise<DurableStorageResult<IDBDatabase>> | undefined;

  async function open(): Promise<DurableStorageResult<IDBDatabase>> {
    if (connection) return success(connection);
    if (!factory) return failure("unavailable", "open");
    if (opening) return opening;
    const pending = new Promise<DurableStorageResult<IDBDatabase>>((resolve) => {
      let settled = false;
      let upgradeFailure: unknown;
      let request: IDBOpenDBRequest;
      try {
        request = factory.open(options.schema.name, options.schema.version);
      } catch (error) {
        resolve(normalizedFailure(error, "open", "openFailed"));
        return;
      }
      request.onupgradeneeded = () => {
        try {
          applyAdditiveSchema(request.result, request.transaction, options.schema);
        } catch (error) {
          upgradeFailure = error;
          request.transaction?.abort();
        }
      };
      request.onblocked = () => {
        options.onBlocked?.();
        if (!settled) {
          settled = true;
          resolve(failure("upgradeBlocked", "open"));
        }
      };
      request.onerror = () => {
        if (!settled) {
          settled = true;
          resolve(normalizedFailure(upgradeFailure ?? request.error, "open", "openFailed"));
        }
      };
      request.onsuccess = () => {
        if (settled) {
          request.result.close();
          return;
        }
        settled = true;
        connection = request.result;
        connection.onversionchange = () => {
          connection?.close();
          connection = undefined;
          options.onVersionChange?.();
        };
        resolve(success(connection));
      };
    }).finally(() => {
      opening = undefined;
    });
    opening = pending;
    return pending;
  }

  function close(): void {
    connection?.close();
    connection = undefined;
  }

  async function get<T>(
    store: string,
    key: IDBValidKey,
  ): Promise<DurableStorageResult<T | undefined>> {
    return read(store, "get", (source) => source.get(key) as IDBRequest<T | undefined>);
  }

  async function getAll<T>(store: string): Promise<DurableStorageResult<T[]>> {
    return read(store, "getAll", (source) => source.getAll() as IDBRequest<T[]>);
  }

  async function queryIndex<T>(query: DurableIndexQuery): Promise<DurableStorageResult<T[]>> {
    const opened = await open();
    if (opened.status === "failure") return opened;
    let transaction: IDBTransaction;
    try {
      transaction = opened.value.transaction(query.store, "readonly");
    } catch (error) {
      return normalizedFailure(error, "queryIndex", "readFailed");
    }
    const values: T[] = [];
    const completion = transactionCompletion(transaction, "queryIndex");
    let request: IDBRequest<IDBCursorWithValue | null>;
    try {
      request = transaction
        .objectStore(query.store)
        .index(query.index)
        .openCursor(query.query, query.direction ?? "next");
    } catch (error) {
      return normalizedFailure(error, "queryIndex", "readFailed");
    }
    const cursorResult = await new Promise<DurableStorageResult<void>>((resolve) => {
      request.onerror = () => resolve(normalizedFailure(request.error, "queryIndex", "readFailed"));
      request.onsuccess = () => {
        const cursor = request.result;
        if (!cursor || (query.limit !== undefined && values.length >= query.limit)) {
          resolve(success(undefined));
          return;
        }
        values.push(structuredClone(cursor.value) as T);
        cursor.continue();
      };
    });
    const committed = await completion;
    return cursorResult.status === "failure"
      ? cursorResult
      : committed.status === "failure"
        ? committed
        : success(values);
  }

  async function mutate(
    mutations: readonly DurableMutation[],
  ): Promise<DurableStorageResult<void>> {
    if (mutations.length === 0) return success(undefined);
    const opened = await open();
    if (opened.status === "failure") return opened;
    const stores = [...new Set(mutations.map((mutation) => mutation.store))];
    let transaction: IDBTransaction;
    try {
      transaction = opened.value.transaction(stores, "readwrite");
    } catch (error) {
      return normalizedFailure(error, "mutate", "writeFailed");
    }
    const completion = transactionCompletion(transaction, "mutate");
    const requests: Promise<DurableStorageResult<unknown>>[] = [];
    try {
      for (const mutation of mutations) {
        const store = transaction.objectStore(mutation.store);
        if (mutation.type === "put")
          requests.push(
            requestResult(
              mutation.key === undefined
                ? store.put(structuredClone(mutation.value))
                : store.put(structuredClone(mutation.value), mutation.key),
              "put",
              "writeFailed",
            ),
          );
        else if (mutation.type === "delete")
          requests.push(requestResult(store.delete(mutation.key), "delete", "deleteFailed"));
        else requests.push(requestResult(store.clear(), "clear", "deleteFailed"));
      }
    } catch (error) {
      transaction.abort();
      return normalizedFailure(error, "mutate", "writeFailed");
    }
    const results = await Promise.all(requests);
    const requestFailure = results.find((result) => result.status === "failure");
    if (requestFailure?.status === "failure") {
      try {
        transaction.abort();
      } catch {
        /* already aborted */
      }
    }
    const committed = await completion;
    return requestFailure?.status === "failure" ? requestFailure : committed;
  }

  const put = (store: string, value: unknown, key?: IDBValidKey) =>
    mutate([{ type: "put", store, value, ...(key === undefined ? {} : { key }) }]);
  const putMany = (store: string, values: readonly unknown[]) =>
    mutate(values.map((value) => ({ type: "put", store, value })));
  const deleteOne = (store: string, key: IDBValidKey) => mutate([{ type: "delete", store, key }]);
  const deleteMany = (store: string, keys: readonly IDBValidKey[]) =>
    mutate(keys.map((key) => ({ type: "delete", store, key })));
  const clear = (store: string) => mutate([{ type: "clear", store }]);

  async function deleteDatabase(): Promise<DurableStorageResult<void>> {
    close();
    if (!factory) return failure("unavailable", "deleteDatabase");
    return new Promise((resolve) => {
      let request: IDBOpenDBRequest;
      try {
        request = factory.deleteDatabase(options.schema.name);
      } catch (error) {
        resolve(normalizedFailure(error, "deleteDatabase", "deleteFailed"));
        return;
      }
      request.onblocked = () => {
        options.onBlocked?.();
        resolve(failure("upgradeBlocked", "deleteDatabase"));
      };
      request.onerror = () =>
        resolve(normalizedFailure(request.error, "deleteDatabase", "deleteFailed"));
      request.onsuccess = () => resolve(success(undefined));
    });
  }

  async function read<T>(
    store: string,
    operation: string,
    createRequest: (store: IDBObjectStore) => IDBRequest<T>,
  ): Promise<DurableStorageResult<T>> {
    const opened = await open();
    if (opened.status === "failure") return opened;
    let transaction: IDBTransaction;
    try {
      transaction = opened.value.transaction(store, "readonly");
    } catch (error) {
      return normalizedFailure(error, operation, "readFailed");
    }
    const completion = transactionCompletion(transaction, operation);
    let result: DurableStorageResult<T>;
    try {
      result = await requestResult(
        createRequest(transaction.objectStore(store)),
        operation,
        "readFailed",
      );
    } catch (error) {
      return normalizedFailure(error, operation, "readFailed");
    }
    const committed = await completion;
    if (result.status === "failure") return result;
    return committed.status === "failure" ? committed : success(structuredClone(result.value));
  }

  return {
    open,
    close,
    get,
    getAll,
    queryIndex,
    mutate,
    put,
    putMany,
    delete: deleteOne,
    deleteMany,
    clear,
    deleteDatabase,
  };
}

function applyAdditiveSchema(
  database: IDBDatabase,
  transaction: IDBTransaction | null,
  schema: DurableDatabaseSchema,
): void {
  for (const definition of schema.stores) {
    let store: IDBObjectStore;
    if (!database.objectStoreNames.contains(definition.name)) {
      store = database.createObjectStore(definition.name, {
        ...(definition.keyPath === undefined ? {} : { keyPath: definition.keyPath }),
        ...(definition.autoIncrement === undefined
          ? {}
          : { autoIncrement: definition.autoIncrement }),
      });
    } else {
      if (!transaction) continue;
      store = transaction.objectStore(definition.name);
    }
    for (const index of definition.indexes ?? [])
      if (!store.indexNames.contains(index.name)) {
        store.createIndex(index.name, index.keyPath, {
          unique: index.unique ?? false,
          multiEntry: index.multiEntry ?? false,
        });
      }
  }
}

function requestResult<T>(
  request: IDBRequest<T>,
  operation: string,
  fallback: DurableStorageErrorCode,
): Promise<DurableStorageResult<T>> {
  return new Promise((resolve) => {
    request.onsuccess = () => resolve(success(request.result));
    request.onerror = () => resolve(normalizedFailure(request.error, operation, fallback));
  });
}

function transactionCompletion(
  transaction: IDBTransaction,
  operation: string,
): Promise<DurableStorageResult<void>> {
  return new Promise((resolve) => {
    transaction.oncomplete = () => resolve(success(undefined));
    transaction.onabort = () =>
      resolve(normalizedFailure(transaction.error, operation, "transactionAborted"));
    transaction.onerror = () => {
      /* abort is the authoritative terminal event */
    };
  });
}

function normalizedFailure(
  error: unknown,
  operation: string,
  fallback: DurableStorageErrorCode,
): DurableStorageResult<never> {
  const name =
    error instanceof DOMException ? error.name : error instanceof Error ? error.name : undefined;
  const code: DurableStorageErrorCode =
    name === "QuotaExceededError"
      ? "quotaExceeded"
      : name === "ConstraintError"
        ? "constraintViolation"
        : name === "DataCloneError"
          ? "cloneFailure"
          : name === "VersionError"
            ? "versionError"
            : name === "AbortError"
              ? "transactionAborted"
              : fallback;
  return { status: "failure", error: { code, operation, ...(name ? { name } : {}) } };
}
function success<T>(value: T): DurableStorageResult<T> {
  return { status: "success", value };
}
function failure(code: DurableStorageErrorCode, operation: string): DurableStorageResult<never> {
  return { status: "failure", error: { code, operation } };
}
