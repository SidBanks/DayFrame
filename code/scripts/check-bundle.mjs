/* global URL, console, process */
import { gzipSync } from "node:zlib";
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { bundlePolicy, evaluateBundlePolicy } from "./bundle-policy.mjs";

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
const metrics = { initialBytes, initialGzip, largestLazy, totalBytes };
const evaluation = evaluateBundlePolicy(metrics);
console.log(
  JSON.stringify(
    {
      initialFiles: [...initialFiles],
      lazyFiles,
      initialBytes,
      initialGzip,
      largestLazy,
      totalBytes,
      policy: bundlePolicy,
      warnings: evaluation.warnings,
    },
    null,
    2,
  ),
);
for (const warning of evaluation.warnings) {
  console.warn(
    `Bundle policy warning: ${warning.name} is ${warning.value} bytes ` +
      `(threshold ${warning.threshold}; ${warning.kind}).`,
  );
}
if (evaluation.failures.length) {
  for (const { name, limit, value } of evaluation.failures)
    console.error(`Bundle budget failed: ${name} is ${value} bytes; hard limit ${limit}.`);
  process.exitCode = 1;
}
