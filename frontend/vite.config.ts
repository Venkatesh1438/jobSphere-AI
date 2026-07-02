import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('node_modules/react-dom/')) {
              return 'react-dom'
            }
            if (id.includes('node_modules/react-router-dom/') || id.includes('node_modules/react-router/')) {
              return 'react-router-dom'
            }
            if (id.includes('node_modules/react/')) {
              return 'react'
            }
            if (id.includes('node_modules/@tanstack/react-query/') || id.includes('node_modules/@tanstack/query-core/')) {
              return 'react-query'
            }
            if (id.includes('node_modules/framer-motion/') || id.includes('node_modules/popmotion/') || id.includes('node_modules/style-value-types/')) {
              return 'framer-motion'
            }
            if (id.includes('node_modules/chart.js/') || id.includes('node_modules/react-chartjs-2/')) {
              return 'chart-js'
            }
            if (id.includes('node_modules/axios/')) {
              return 'axios'
            }
            return 'vendor'
          }
        },
      },
    },
  },
})
