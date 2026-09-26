import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.dirname(fileURLToPath(import.meta.url));
const code = path.resolve(root, "../../../../../code");
const seed = process.env.DAYFRAME_925_QA === "seed";
export default {
  root,
  build: seed
    ? {
        outDir: "/tmp/dayframe-925-seed-build-RESULT",
        lib: {
          entry: path.join(root, "canonical-seed-RESULT.ts"),
          name: "DayFrame925Seed",
          formats: ["iife"],
          fileName: () => "canonical-seed-RESULT.js",
        },
      }
    : {
        outDir: "/tmp/dayframe-925-defensive-build-RESULT",
        rolldownOptions: {
          input: path.join(root, "defensive-harness-RESULT.html"),
        },
      },
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      react: path.join(code, "node_modules/react"),
      "react-dom": path.join(code, "node_modules/react-dom"),
    },
  },
  esbuild: { jsx: "automatic" },
};
