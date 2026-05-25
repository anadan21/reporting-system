import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost/it-reporting-system/public',
        changeOrigin: true,
        secure: false,
      },
      '/storage': {
        target: 'http://localhost/it-reporting-system/public',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
