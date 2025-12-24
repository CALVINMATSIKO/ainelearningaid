import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react()
  ],
  base: process.env.VERCEL ? '/' : '/ainelearningaid/',
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../../shared')
    }
  }
})