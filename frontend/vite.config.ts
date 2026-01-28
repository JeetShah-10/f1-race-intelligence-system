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
          // Three.js ecosystem (heavy, load separately)
          'three': ['three'],
          'react-three': ['@react-three/fiber', '@react-three/drei'],
        },
      },
    },
    // Target modern browsers for smaller bundles
    target: 'esnext',
    // Minify with esbuild (faster than terser)
    minify: 'esbuild',
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'zustand',
      'framer-motion',
    ],
  },
})
