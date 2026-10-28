import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'

export default defineConfig(({ mode }) => {
  const assetUrl = loadEnv(mode, process.cwd(), 'VITE_').VITE_ASSET_URL

  return {
    plugins: [react()],
    server: {
      host: true,
      port: 5173,
      proxy: {
        // Local preview: load original uploaded product photos from the existing site.
        // Enabled only by local env config; production serving is unchanged.
        ...(assetUrl ? {
          '/uploads': {
            target: assetUrl,
            changeOrigin: true
          }
        } : {}),
        // Catch-all if the old 'backend-api' string gets sent by the browser
        '/backend-api': {
          target: 'http://stem_backend:8000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/backend-api/, '')
        },
        // Standard catch-all for clean paths
        '/api': {
          target: 'http://stem_backend:8000',
          changeOrigin: true
        },
        '/auth': {
          target: 'http://stem_backend:8000',
          changeOrigin: true
        },
        // Admin API — must be proxied, not served by the SPA
        '/admin': {
          target: 'http://stem_backend:8000',
          changeOrigin: true
        }
      }
    }
  }
})
