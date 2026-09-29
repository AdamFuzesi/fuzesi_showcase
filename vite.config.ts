import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Output stays in build/ so the existing gh-pages deploy and the 3D site's iframe URL keep working.
export default defineConfig({
  plugins: [react()],
  base: "/",
  server: { port: 3000 },
  build: {
    outDir: "build",
    emptyOutDir: true,
    // three.js lives in its own lazy chunk (the Projects phone); it's ~150 kB gzipped by design.
    chunkSizeWarningLimit: 650,
  },
});
