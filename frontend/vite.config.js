import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:300',
        changeOrigin: true,
        credentials: true,
      },
      '/search': {
        target: 'http://localhost:300',
        changeOrigin: true,
        credentials: true,
      },
      '/city': {
        target: 'http://localhost:300',
        changeOrigin: true,
        credentials: true,
      },
      '/region': {
        target: 'http://localhost:300',
        changeOrigin: true,
        credentials: true,
      },
      '/category': {
        target: 'http://localhost:300',
        changeOrigin: true,
        credentials: true,
      },
      '/shop': {
        target: 'http://localhost:300',
        changeOrigin: true,
        credentials: true,
      },
      '/auth': {
        target: 'http://localhost:300',
        changeOrigin: true,
        credentials: true,
      },
      '/reservation': {
        target: 'http://localhost:300',
        changeOrigin: true,
        credentials: true,
      },
      '/uploads': {
        target: 'http://localhost:300',
        changeOrigin: true,
        credentials: true,
      }
    },
    historyApiFallback: true
  }
})
