
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { StatusServidor } from './StatusServidor'

const { verificarServidorFalso } = vi.hoisted(() => ({
  verificarServidorFalso: vi.fn(),
}))

vi.mock('../services/saudeService', () => ({
  verificarServidor: verificarServidorFalso,
}))

beforeEach(() => {
  verificarServidorFalso.mockReset()
})

afterEach(() => vi.useRealTimers())

describe('StatusServidor', () => {
  it('só mostra a mensagem de conexao se a resposta demorar', () => {
    vi.useFakeTimers()
    verificarServidorFalso.mockImplementation(
      () => new Promise(() => {}),
    )

    render(<StatusServidor />)

    // Logo no começo não aparece nada: evita a página "pular" quando o servidor responde rápido.
    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1600)
    })

    expect(screen.getByRole('status')).toHaveTextContent(
      'Conectando ao servidor',
    )
    expect(verificarServidorFalso).toHaveBeenCalledTimes(1)
  })

  it('remove a mensagem quando o servidor responde', async () => {
    verificarServidorFalso.mockResolvedValue({ status: 'UP' })

    const { container } = render(<StatusServidor />)

    await waitFor(() => {
      expect(container).toBeEmptyDOMElement()
    })

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('considera HTTP 404 como servidor acessivel', async () => {
    verificarServidorFalso.mockRejectedValue({ status: 404 })

    const { container } = render(<StatusServidor />)

    await waitFor(() => {
      expect(container).toBeEmptyDOMElement()
    })

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('exibe aviso quando o servidor retorna HTTP 500', async () => {
    verificarServidorFalso.mockRejectedValue({ status: 500 })

    render(<StatusServidor />)

    const aviso = await screen.findByRole('alert')

    expect(aviso).toHaveTextContent(
      'Não conseguimos falar com o servidor agora',
    )
    expect(
      screen.getByRole('button', { name: /tentar de novo/i }),
    ).toBeInTheDocument()
  })

  it('permite tentar novamente apos uma falha', async () => {
    verificarServidorFalso
      .mockRejectedValueOnce({ status: 500 })
      .mockResolvedValueOnce({ status: 'UP' })

    const { container } = render(<StatusServidor />)

    const botao = await screen.findByRole('button', {
      name: /tentar de novo/i,
    })

    fireEvent.click(botao)

    await waitFor(() => {
      expect(verificarServidorFalso).toHaveBeenCalledTimes(2)
      expect(container).toBeEmptyDOMElement()
    })

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
