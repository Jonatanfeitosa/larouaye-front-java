import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderNaRota } from '../test/ajudantes'
import { Navbar } from './Navbar'

describe('Navbar', () => {
  it('tem os 7 links dentro de uma nav com nome', () => {
    renderNaRota(<Navbar />)
    const nav = screen.getByRole('navigation', { name: 'Principal' })
    expect(nav.querySelectorAll('a')).toHaveLength(7)
  })
  it('marca a página atual com aria-current', () => {
    renderNaRota(<Navbar />, '/', '/')
    expect(screen.getByRole('link', { name: 'Início' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Sobre' })).not.toHaveAttribute('aria-current')
  })
  it('o botão do menu informa aberto e fechado (aria-expanded) e liga ao menu', async () => {
    renderNaRota(<Navbar />)
    const botao = screen.getByRole('button', { name: 'Abrir menu' })
    expect(botao).toHaveAttribute('aria-expanded', 'false')
    expect(botao).toHaveAttribute('aria-controls', 'menu-principal')
    await userEvent.click(botao)
    expect(screen.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute('aria-expanded', 'true')
  })
})
