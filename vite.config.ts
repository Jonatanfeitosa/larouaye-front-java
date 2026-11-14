import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Em desenvolvimento, /api vai para o Java (ou para o mock) sem problema de CORS.
  const alvo = env.VITE_PROXY_TARGET || 'http://localhost:8080'
  return {
    plugins: [react(), tailwindcss()],
    server: { proxy: { '/api': { target: alvo, changeOrigin: true } } },
  }
})
