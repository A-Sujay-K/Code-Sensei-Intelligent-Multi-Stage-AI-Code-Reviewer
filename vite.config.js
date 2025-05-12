import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  base: './',
  server: {
    port: 4173
  },
  preview: {
    port: 4173
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@monaco-editor/react', 'react-spinners'],
          markdown: ['react-markdown', 'rehype-highlight'],
          ai: ['@google/generative-ai'],
          icons: ['lucide-react']
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['monaco-editor']
  }
})