import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CampoTexto } from './CampoTexto'

describe('CampoTexto (acessibilidade)', () => {
  it('liga o rótulo ao campo', () => {
    render(<CampoTexto id="nome" rotulo="Nome" />)
    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
  })

  it('com erro: marca aria-invalid e liga a mensagem por aria-describedby', () => {
    render(<CampoTexto id="email" rotulo="E-mail" erro="Digite um e-mail válido." />)
    const campo = screen.getByLabelText('E-mail')
    expect(campo).toHaveAttribute('aria-invalid', 'true')
    expect(campo).toHaveAccessibleDescription('Digite um e-mail válido.')
  })

  it('sem erro: não marca como inválido', () => {
    render(<CampoTexto id="nome" rotulo="Nome" />)
    expect(screen.getByLabelText('Nome')).toHaveAttribute('aria-invalid', 'false')
  })
})
