/* global URL, console, process */
import { gzipSync } from "node:zlib";
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const manifest = JSON.parse(readFileSync(join(root, "dist/.vite/manifest.json"), "utf8"));
const entry = Object.entries(manifest).find(([, item]) => item.isEntry);
if (!entry)
  throw new Error(
    "Bundle budget failed: Vite entry manifest was not found. Run npm run build first.",
  );
const initialFiles = new Set();
function include(key) {
  const item = manifest[key];
  if (!item || initialFiles.has(item.file)) return;
  initialFiles.add(item.file);
  for (const dependency of item.imports ?? []) include(dependency);
}
include(entry[0]);
const jsFiles = Object.values(manifest)
  .filter((item) => item.file.endsWith(".js"))
  .map((item) => item.file);
const bytes = (file) => statSync(join(root, "dist", file)).size;
const gzip = (file) => gzipSync(readFileSync(join(root, "dist", file))).length;
const initialBytes = [...initialFiles].reduce((total, file) => total + bytes(file), 0);
const initialGzip = [...initialFiles].reduce((total, file) => total + gzip(file), 0);
const lazyFiles = jsFiles.filter((file) => !initialFiles.has(file));
const largestLazy = Math.max(0, ...lazyFiles.map(bytes));
const totalBytes = jsFiles.reduce((total, file) => total + bytes(file), 0);
const budgets = {
  initialBytes: 685_000,
  initialGzip: 170_000,
  largestLazy: 100_000,
  totalBytes: 750_000,
};
const failures = Object.entries(budgets).filter(
  ([name, limit]) => ({ initialBytes, initialGzip, largestLazy, totalBytes })[name] > limit,
);
console.log(
  JSON.stringify(
    {
      initialFiles: [...initialFiles],
      lazyFiles,
      initialBytes,
      initialGzip,
      largestLazy,
      totalBytes,
      budgets,
    },
    null,
    2,
  ),
);
if (failures.length) {
  for (const [name, limit] of failures)
    console.error(`Bundle budget failed: ${name} exceeds ${limit} bytes.`);
  process.exitCode = 1;
}
