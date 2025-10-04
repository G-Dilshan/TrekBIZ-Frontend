import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    historyApiFallback: true,
  },
  base: process.env.VITE_BASE_PATH || "/TrekBIZ-Frontend",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist", // 👈 revert to default
  },
});