import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderNaRota } from '../test/ajudantes'
import { NaoEncontrada } from './NaoEncontrada'

describe('NaoEncontrada (404)', () => {
  it('explica o problema e oferece o caminho de volta', () => {
    renderNaRota(<NaoEncontrada />, '/qualquer', '*')
    expect(screen.getByRole('heading', { level: 1, name: 'Página não encontrada' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Voltar ao início' })).toHaveAttribute('href', '/')
  })
})
