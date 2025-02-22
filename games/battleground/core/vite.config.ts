import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "core",
    },
    rollupOptions: {
      external: ["pixi-filters", "pixi.js", "gsap", /^@rpg-village/],
    },
    minify: false,
  },
});
