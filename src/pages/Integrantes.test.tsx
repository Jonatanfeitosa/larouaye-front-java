import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { INTEGRANTES } from '../data/integrantes'
import { renderNaRota } from '../test/ajudantes'
import { Integrantes } from './Integrantes'

describe('Integrantes', () => {
  it('mostra um cartão para cada integrante', () => {
    renderNaRota(<Integrantes />)
    expect(screen.getAllByRole('listitem')).toHaveLength(INTEGRANTES.length)
  })
  it('cada link leva à rota dinâmica e diz o nome da pessoa para leitor de tela', () => {
    renderNaRota(<Integrantes />)
    const primeiro = INTEGRANTES[0]
    const link = screen.getByRole('link', { name: new RegExp(`Ver detalhes.*${primeiro.nome}`) })
    expect(link).toHaveAttribute('href', `/integrantes/${primeiro.id}`)
  })
})
