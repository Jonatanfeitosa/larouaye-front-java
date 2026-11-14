import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('chama o clique', async () => {
    const aoClicar = vi.fn()
    render(<Button onClick={aoClicar}>Enviar</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Enviar' }))
    expect(aoClicar).toHaveBeenCalledOnce()
  })

  it('carregando: desabilita, avisa aria-busy e troca o texto', () => {
    render(<Button carregando textoCarregando="Enviando…">Enviar</Button>)
    const botao = screen.getByRole('button', { name: 'Enviando…' })
    expect(botao).toBeDisabled()
    expect(botao).toHaveAttribute('aria-busy', 'true')
  })

  it('por padrão não envia formulário sem querer (type=button)', () => {
    render(<Button>Ok</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })
})
