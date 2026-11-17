import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { INTEGRANTES } from '../data/integrantes'
import { renderNaRota } from '../test/ajudantes'
import { IntegranteDetalhe } from './IntegranteDetalhe'

describe('IntegranteDetalhe (rota dinâmica /integrantes/:id)', () => {
  it('mostra os dados de quem está no endereço', () => {
    const i = INTEGRANTES[1]
    renderNaRota(<IntegranteDetalhe />, `/integrantes/${i.id}`, '/integrantes/:id')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(i.nome)
    expect(screen.getByText(i.papel)).toBeInTheDocument()
    expect(document.title).toContain(i.nome)
  })
  it('id que não existe: mensagem amigável com caminho de volta', () => {
    renderNaRota(<IntegranteDetalhe />, '/integrantes/xyz', '/integrantes/:id')
    expect(screen.getByRole('heading', { level: 1, name: 'Integrante não encontrado' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver todos os integrantes' })).toHaveAttribute('href', '/integrantes')
  })
})
