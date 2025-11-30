import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { qrcode } from 'vite-plugin-qrcode'   // Enable QR code plugin

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    qrcode(),   // Generates a QR code in the terminal
  ],
  server: {
    open: true, // Automatically opens the browser on desktop
    host: true, // Exposes the server on the local network (for mobile)
  },
})
