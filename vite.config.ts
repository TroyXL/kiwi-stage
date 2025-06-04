import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import vueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vueRouter(), vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '^/metavm-tech/': {
        target: 'https://metavm.tech',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/https:\/\/metavm.tech/, ''),
      },
    },
  },
})
