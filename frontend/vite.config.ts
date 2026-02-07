import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Increase chunk warning limit
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Manual chunks for better caching and parallel loading
        manualChunks: {
          // React core - rarely changes
          'react-vendor': ['react', 'react-dom'],
          // Router - UI foundation
          'router': ['react-router-dom'],
          // State management
          'state': ['zustand'],
          // Animation library (used heavily in landing page)
          'framer': ['framer-motion'],
        },
      },
    },
    // Target modern browsers for smaller bundles
    target: 'esnext',
    // Minify with esbuild (faster than terser)
    minify: 'esbuild',
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      'framer-motion',
    ],
  },
  server: {
    host: true,
  },
})
