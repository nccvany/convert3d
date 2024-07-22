import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // Preserve the file names of the input files
        entryFileNames: "[name].js",
      },
    },
  },
});
