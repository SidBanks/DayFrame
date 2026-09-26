import { fileURLToPath } from "node:url";
export default { test: { environment: "node", include: [fileURLToPath(new URL("./correction-publication-repro-RESULT.test.ts", import.meta.url))] } };
