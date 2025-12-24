import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react()
  ],
  base: process.env.VERCEL ? '/' : '/ainelearningaid/',
  build: {
    outDir: process.env.VERCEL ? '../dist' : 'dist'
  },
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../../shared')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})