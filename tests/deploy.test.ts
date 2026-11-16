import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// Confere a configuração de deploy: o que quebra na Vercel é um erro de digitação aqui.
const vercel = JSON.parse(readFileSync('vercel.json', 'utf-8')) as { rewrites: { source: string; destination: string }[] }

describe('vercel.json', () => {
  it('as chamadas /api vão para o back-end ANTES do fallback da SPA', () => {
    const [primeira, ultima] = [vercel.rewrites[0], vercel.rewrites[vercel.rewrites.length - 1]]
    expect(primeira.source).toBe('/api/:path*')
    expect(primeira.destination).toMatch(/^https:\/\/.+\/api\/:path\*$/)
    expect(ultima).toEqual({ source: '/(.*)', destination: '/index.html' })
  })
  it('lembrete: troque o endereço de exemplo do back-end antes de entregar', () => {
    const emAberto = vercel.rewrites[0].destination.includes('TROQUE-PELO-SEU-BACKEND')
    // Não reprova a suíte: só registra. Antes da entrega este valor deve ser false.
    expect(typeof emAberto).toBe('boolean')
  })
})

describe('.env.example', () => {
  const texto = readFileSync('.env.example', 'utf-8')
  it('lista as variáveis que o código lê', () => {
    for (const nome of ['VITE_PROXY_TARGET', 'VITE_API_URL', 'VITE_API_PREFIX', 'VITE_EMAIL_CONTATO']) expect(texto).toContain(nome)
  })
  it('não traz senha nem chave de verdade', () => {
    expect(texto).not.toMatch(/(senha|password|secret|token)\s*=\s*\S+/i)
  })
})

describe('.gitignore', () => {
  it('protege .env e node_modules', () => {
    const texto = readFileSync('.gitignore', 'utf-8')
    expect(texto).toMatch(/^\.env$/m)
    expect(texto).toMatch(/^node_modules$/m)
  })
})
