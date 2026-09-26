import { fileURLToPath } from "node:url";
export default {
  test: {
    environment: "node",
    include: [
      fileURLToPath(
        new URL(
          "./realization-replacement-repro-RESULT.test.ts",
          import.meta.url,
        ),
      ),
    ],
  },
};
