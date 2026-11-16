// @vitest-environment node
import { spawn, type ChildProcess } from 'node:child_process'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

// Sobe o mock de verdade (porta 8080) e fala com ele por HTTP, como o front faz.
let processo: ChildProcess
const base = 'http://localhost:8080/api'

beforeAll(async () => {
  processo = spawn('node', ['mock/mock-api.mjs'], { stdio: 'pipe' })
  await new Promise<void>((ok, falha) => {
    const t = setTimeout(() => falha(new Error('mock não subiu')), 8000)
    processo.stdout?.on('data', (d: Buffer) => { if (String(d).includes('mock em')) { clearTimeout(t); ok() } })
    processo.on('error', falha)
  })
})
afterAll(() => { processo?.kill() })

describe('mock da API Java', () => {
  it('GET /orientacoes devolve uma lista', async () => {
    const r = await fetch(`${base}/orientacoes`)
    expect(r.status).toBe(200)
    expect(Array.isArray(await r.json())).toBe(true)
  })
  it('POST /usuarios cria um usuário com id', async () => {
    const r = await fetch(`${base}/usuarios`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome: 'Ana' }) })
    expect([200, 201]).toContain(r.status)
    expect(await r.json()).toMatchObject({ nome: 'Ana' })
  })
  it('POST de progresso é guardado e aparece no GET', async () => {
    const u = await (await fetch(`${base}/usuarios`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nome: 'Beto' }) })).json() as { id: number }
    await fetch(`${base}/usuarios/${u.id}/etapas`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ etapaId: 1, status: 'CONCLUIDA' }) })
    const lista = await (await fetch(`${base}/usuarios/${u.id}/etapas`)).json() as { etapaId: number; status: string }[]
    expect(lista).toContainEqual({ etapaId: 1, status: 'CONCLUIDA' })
  })
  it('rota inexistente devolve 404', async () => {
    expect((await fetch(`${base}/nao-existe`)).status).toBe(404)
  })
})
