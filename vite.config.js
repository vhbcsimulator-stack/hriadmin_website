import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { localContentApi } from './vite.content-plugin.js'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      // shared/content/*.js imports its data source through this specifier.
      // The admin resolves it to its own read/write store; the public site
      // resolves the same specifier to a read-only one.
      '@content-backend': fileURLToPath(new URL('./src/lib/contentStore.js', import.meta.url)),
    },
  },
  plugins: [
    react(),
    // Fallback content service used only until Supabase is configured.
    localContentApi(fileURLToPath(new URL('../content/site-content.json', import.meta.url))),
  ],
})
