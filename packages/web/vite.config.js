import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
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
    react(),
    viteStaticCopy({
      targets: [{ src: "src/assets/**/*", dest: "assets" }],
    }),
  ],
});
