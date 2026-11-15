import { describe, expect, it } from 'vitest'
import { contatoSchema } from './contatoSchema'

const valido = { nome: 'Ana Souza', email: 'ana@exemplo.com', assunto: 'Sugestão', mensagem: 'Gostei muito do site, parabéns.' }

describe('contatoSchema', () => {
  it('aceita um formulário completo', () => {
    expect(contatoSchema.safeParse(valido).success).toBe(true)
  })
  it.each([
    ['nome', '', 'Escreva seu nome.'],
    ['email', 'ana@', 'Digite um e-mail válido'],
    ['assunto', 'a', 'Escreva o assunto.'],
    ['mensagem', 'curta', 'Escreva pelo menos 10 caracteres'],
  ])('recusa %s inválido com mensagem clara', (campo, valor, trecho) => {
    const r = contatoSchema.safeParse({ ...valido, [campo]: valor })
    expect(r.success).toBe(false)
    if (!r.success) expect(r.error.issues[0].message).toContain(trecho)
  })
  it('limita o tamanho da mensagem em 500 caracteres', () => {
    expect(contatoSchema.safeParse({ ...valido, mensagem: 'a'.repeat(501) }).success).toBe(false)
    expect(contatoSchema.safeParse({ ...valido, mensagem: 'a'.repeat(500) }).success).toBe(true)
  })
})
