import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MensagemChat } from './MensagemChat'
import type { Voz } from './mensagemTipos'

const voz = (extra: Partial<Voz> = {}): Voz => ({ suportado: true, falando: false, falar: vi.fn(), parar: vi.fn(), ...extra })

describe('MensagemChat', () => {
  it('mostra a pergunta da pessoa com aviso para leitor de tela', () => {
    render(<ul><MensagemChat mensagem={{ id: 1, autor: 'usuario', texto: 'Como verifico dívidas?' }} voz={voz()} /></ul>)
    expect(screen.getByText('Você perguntou:')).toBeInTheDocument()
    expect(screen.getByText('Como verifico dívidas?')).toBeInTheDocument()
  })

  it('mostra resposta com cuidados e a base legal com link seguro', () => {
    render(
      <ul>
        <MensagemChat
          voz={voz()}
          mensagem={{
            id: 2, autor: 'assistente', titulo: 'Matrícula', texto: 'Peça a certidão.',
            cuidados: ['Confira a data'],
            baseLegal: [{ norma: 'Lei 6.015/1973', url: 'https://exemplo.gov.br' }],
          }}
        />
      </ul>,
    )
    expect(screen.getByRole('heading', { name: 'Matrícula' })).toBeInTheDocument()
    expect(screen.getByText('Confira a data')).toBeInTheDocument()
    const link = screen.getByRole('link', { name: /Lei 6.015\/1973/ })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'))
    expect(link).toHaveTextContent('abre em nova aba')
  })

  it('o botão de ouvir lê o título, o texto e os cuidados', async () => {
    const falar = vi.fn()
    render(
      <ul>
        <MensagemChat voz={voz({ falar })} mensagem={{ id: 3, autor: 'assistente', titulo: 'T', texto: 'Texto.', cuidados: ['C1'] }} />
      </ul>,
    )
    await userEvent.click(screen.getByRole('button', { name: /ouvir/i }))
    expect(falar).toHaveBeenCalledWith('T. Texto.. C1')
  })

  it('sem suporte a voz, não mostra o botão de ouvir', () => {
    render(<ul><MensagemChat voz={voz({ suportado: false })} mensagem={{ id: 4, autor: 'assistente', texto: 'Oi' }} /></ul>)
    expect(screen.queryByRole('button', { name: /ouvir/i })).not.toBeInTheDocument()
  })
})
