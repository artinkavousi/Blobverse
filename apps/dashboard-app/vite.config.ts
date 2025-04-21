import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import shader from 'vite-plugin-shader'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), shader({ raw: true })],
})
