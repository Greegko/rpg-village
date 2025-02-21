import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  resolve: {
    alias: {
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@web": path.resolve(__dirname, "./src/game"),
    },
  },
  server: {
    port: 8080,
  },
  plugins: [
    solid(),
    viteStaticCopy({ targets: [{ src: "src/assets/**/*", dest: "assets" }] }),
    tailwindcss(),
    {
      hotUpdate({ modules, timestamp }) {
        const invalidatedModules = new Set();
        for (const mod of modules) {
          this.environment.moduleGraph.invalidateModule(mod, invalidatedModules, timestamp, true);
        }
        this.environment.hot.send({ type: "full-reload" });
        return [];
      },
    },
  ],
});
