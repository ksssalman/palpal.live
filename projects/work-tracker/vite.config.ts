import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: [
        // Exclude Firebase Hosting reserved URLs from bundling
        // These URLs are only available in Firebase Hosting environment
        /^\/__\//
      ]
    }
  },
})
