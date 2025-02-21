import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "aa29-2401-4900-1c27-a6eb-400c-973-55c0-651f.ngrok-free.app",
    ],
  },
});
