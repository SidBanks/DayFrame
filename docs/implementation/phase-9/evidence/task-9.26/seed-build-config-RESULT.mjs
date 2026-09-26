import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.dirname(fileURLToPath(import.meta.url));
export default {
  build: {
    outDir: "/tmp/dayframe-926-seed-build-RESULT",
    lib: {
      entry: path.join(root, "canonical-seed-RESULT.ts"),
      name: "DayFrame926Seed",
      formats: ["iife"],
      fileName: () => "canonical-seed-RESULT.js",
    },
  },
};
