import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderNaRota } from '../test/ajudantes'
import { Home } from './Home'

describe('Home', () => {
  it('tem um único h1 com a promessa do projeto', () => {
    renderNaRota(<Home />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('sem juridiquês')
  })
  it('oferece o caminho principal para o assistente', () => {
    renderNaRota(<Home />)
    expect(screen.getAllByRole('link').some((l) => l.getAttribute('href') === '/assistente')).toBe(true)
  })
  it('mostra o aviso de que é informação geral', () => {
    renderNaRota(<Home />)
    expect(screen.getByText(/advogado/i)).toBeInTheDocument()
  })
})
