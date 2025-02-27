import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  server: {
    port: 8080,
  },
  plugins: [
    solid(),
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
