import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  // NEW: Add the local development proxy for Traccar API
  server: {
    proxy: {
      '/traccar-api': {
        target: 'https://fleet.aptic.co.ke/api',
        changeOrigin: true,
        secure: false, // Prevents SSL cert errors during local proxying
        rewrite: (path) => path.replace(/^\/traccar-api/, '')
      }
    }
  }
})
