import { defineConfig } from 'vite'

import { foldkit } from '@foldkit/vite-plugin'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), foldkit({ devToolsMcpPort: 9989 })],
  server: {
    port: 5174,
    strictPort: true,
  },
  optimizeDeps: {
    entries: ['src/entry.ts'],
  },
})
