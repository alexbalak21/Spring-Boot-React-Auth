import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
   server: {
    proxy: {
      "/api": {
        target: "http://localhost:8100",
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost'
      },
    },
  },
  build: {
    outDir: path.resolve(__dirname, "../src/main/resources/static"),
    emptyOutDir: true,
  },
})
