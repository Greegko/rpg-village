import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  server: {
    port: 8080,
  },
  plugins: [
    solid(),
    {
      name: "full-reload",
      handleHotUpdate({ server }) {
        server.ws.send({ type: "full-reload" });
        return [];
      },
    },
  ],
});
