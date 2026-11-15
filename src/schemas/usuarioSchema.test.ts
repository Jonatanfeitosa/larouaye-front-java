import { describe, expect, it } from 'vitest'
import { usuarioSchema } from './usuarioSchema'

describe('usuarioSchema', () => {
  it('aceita só o nome, com e-mail vazio', () => {
    expect(usuarioSchema.safeParse({ nome: 'Ana', email: '' }).success).toBe(true)
  })
  it('aceita nome e e-mail válidos', () => {
    expect(usuarioSchema.safeParse({ nome: 'Ana Souza', email: 'ana@exemplo.com' }).success).toBe(true)
  })
  it('recusa nome curto e explica em português simples', () => {
    const r = usuarioSchema.safeParse({ nome: 'A', email: '' })
    expect(r.success).toBe(false)
    if (!r.success) expect(r.error.issues[0].message).toContain('Escreva seu nome')
  })
  it('recusa e-mail inválido', () => {
    expect(usuarioSchema.safeParse({ nome: 'Ana', email: 'ana@' }).success).toBe(false)
  })
  it('ignora espaços nas pontas do nome', () => {
    const r = usuarioSchema.safeParse({ nome: '  Ana  ', email: '' })
    expect(r.success && r.data.nome).toBe('Ana')
  })
})
