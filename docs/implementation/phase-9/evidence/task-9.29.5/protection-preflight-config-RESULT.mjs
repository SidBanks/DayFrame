import { fileURLToPath } from "node:url";
export default {
  test: {
    environment: "node",
    include: [
      fileURLToPath(
        new URL("./protection-preflight-RESULT.test.ts", import.meta.url),
      ),
    ],
  },
};
