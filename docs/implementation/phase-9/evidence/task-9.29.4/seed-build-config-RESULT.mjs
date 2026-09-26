import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.dirname(fileURLToPath(import.meta.url));
export default { build: { outDir: "/tmp/dayframe-9294-seed-build-RESULT", lib: { entry: path.join(root, "canonical-seed-RESULT.ts"), name: "Acceptance9294Seed", formats: ["iife"], fileName: () => "canonical-seed-RESULT.js" } } };
