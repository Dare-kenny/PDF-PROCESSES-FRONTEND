import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any call to /pdf/* from the browser will be forwarded to Spring Boot
      "/pdf": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});