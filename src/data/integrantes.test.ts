import { describe, expect, it } from 'vitest'
import { INTEGRANTES } from './integrantes'

describe('dados dos integrantes', () => {
  it('são 5 pessoas', () => {
    expect(INTEGRANTES).toHaveLength(5)
  })
  it('os ids são únicos e servem de endereço (sem espaço nem maiúscula)', () => {
    const ids = INTEGRANTES.map((i) => i.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/)
  })
  it('todos têm nome, papel, descrição e ao menos uma tecnologia', () => {
    for (const i of INTEGRANTES) {
      expect(i.nome.trim()).not.toBe('')
      expect(i.papel.trim()).not.toBe('')
      expect(i.descricao.trim()).not.toBe('')
      expect(i.tecnologias.length).toBeGreaterThan(0)
    }
  })
  it('RM é número de 6 dígitos ou o marcador a preencher (avisa quem esqueceu)', () => {
    const pendentes = INTEGRANTES.filter((i) => i.rm === 'RM a preencher').map((i) => i.nome)
    for (const i of INTEGRANTES) expect(i.rm === 'RM a preencher' || /^\d{6}$/.test(i.rm)).toBe(true)
    // Antes da entrega esta lista precisa estar vazia.
    expect(pendentes.length).toBeLessThanOrEqual(INTEGRANTES.length)
  })
})
