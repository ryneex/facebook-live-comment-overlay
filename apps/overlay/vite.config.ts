import path from "path"
import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"

const dist = path.resolve(import.meta.dirname, "../server/dist/overlay")
const port = 5174

export default defineConfig({
  build: {
    outDir: dist,
    emptyOutDir: true,
  },
  server: {
    port,
  },
  resolve: {
    alias: {
      "@repo/ui": path.resolve("../../packages/ui/src"),
    },
  },
  clearScreen: false,

  plugins: [react(), tailwindcss()],
})
