import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'
import { classesBotao, type Variante } from './estilosBotao'

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

  // Regressão do bug "passo o mouse e o texto some": o hover nunca pode usar cor translúcida (/10, /15...)
  // nem filtro, e precisa fixar a cor do texto.
  it.each<Variante>(['primario', 'secundario', 'destaque'])('variante %s: hover com cor sólida e texto fixo', (v) => {
    const classes = classesBotao(v).split(' ')
    const hover = classes.filter((c) => c.includes('hover:'))
    expect(hover.some((c) => c.includes('hover:bg-'))).toBe(true)
    expect(hover.some((c) => c.includes('hover:text-'))).toBe(true)
    for (const c of hover) {
      expect(c).not.toMatch(/\/\d+$/) // sem opacidade: bg-azul/10
      expect(c).not.toContain('brightness')
    }
  })
})
