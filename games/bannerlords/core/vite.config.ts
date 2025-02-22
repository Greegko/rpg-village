import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [dts({ pathsToAliases: true }), tsconfigPaths()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "core",
    },
    rollupOptions: {
      external: /^@rpg-village/,
    },
    minify: false,
  },
});
