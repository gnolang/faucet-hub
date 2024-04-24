import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Markdown from 'unplugin-vue-markdown/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),
    Markdown({}),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
    },
  },
})
