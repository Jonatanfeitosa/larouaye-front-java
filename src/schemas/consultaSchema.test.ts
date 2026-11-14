import { describe, expect, it } from 'vitest'
import { ETAPAS_COMPRA, UFS } from '../data/opcoes'
import { consultaSchema } from './consultaSchema'

const valido = { pergunta: 'Como verificar se o imóvel tem dívidas?', uf: UFS[0], etapa: ETAPAS_COMPRA[0].valor }

describe('consultaSchema', () => {
  it('aceita uma pergunta completa', () => {
    expect(consultaSchema.safeParse(valido).success).toBe(true)
  })
  it('recusa pergunta curta demais', () => {
    expect(consultaSchema.safeParse({ ...valido, pergunta: 'oi' }).success).toBe(false)
  })
  it('recusa pergunta com mais de 1000 caracteres', () => {
    expect(consultaSchema.safeParse({ ...valido, pergunta: 'a'.repeat(1001) }).success).toBe(false)
  })
  it('recusa UF e etapa fora da lista', () => {
    expect(consultaSchema.safeParse({ ...valido, uf: 'XX' }).success).toBe(false)
    expect(consultaSchema.safeParse({ ...valido, etapa: 'INVENTADA' }).success).toBe(false)
  })
  it('todas as etapas e UFs oferecidas no formulário são aceitas', () => {
    for (const e of ETAPAS_COMPRA) expect(consultaSchema.safeParse({ ...valido, etapa: e.valor }).success).toBe(true)
    for (const uf of UFS) expect(consultaSchema.safeParse({ ...valido, uf }).success).toBe(true)
  })
  it('as 27 UFs estão na lista', () => {
    expect(UFS).toHaveLength(27)
  })
})
