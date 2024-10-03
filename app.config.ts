import { defineConfig } from "@tanstack/start/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    // preset: "vercel",
    // preset: "bun",
    preset: "node-server",
  },
  vite: {
    plugins: () => [
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
    ],
  },
});
