import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderNaRota } from '../test/ajudantes'
import { Sobre } from './Sobre'

describe('Sobre', () => {
  it('tem um único h1 e define o título da aba', () => {
    renderNaRota(<Sobre />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(document.title).toContain('Sobre')
  })
  it('as seções têm nome acessível (landmarks)', () => {
    renderNaRota(<Sobre />)
    expect(screen.getAllByRole('region').length).toBeGreaterThan(0)
  })
})
