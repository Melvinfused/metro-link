import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/metro-link/",
  publicDir: 'public', // Ensure public folder is copied to dist
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Copy public folder contents to root of dist
    copyPublicDir: true
  }
})
