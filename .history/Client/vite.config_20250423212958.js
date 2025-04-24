import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      "05fc-2001-df7-be80-abf-00-3.ngrok-free.app", // Add your ngrok host here
      "localhost", // Optional: Keep localhost for local development
    ],
  },
});
