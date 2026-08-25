import { defineConfig } from "vite";

export default defineConfig({
  build: {
    manifest: true,
    rolldownOptions: {
      output: {
        manualChunks(id) {
          return id.includes("/node_modules/react/") ||
            id.includes("/node_modules/react-dom/") ||
            id.includes("/node_modules/scheduler/")
            ? "vendor-react"
            : undefined;
        },
      },
    },
  },
});
