
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { AcessibilidadeProvider } from '../contexts/AcessibilidadeContext'
import { BarraAcessibilidade } from './BarraAcessibilidade'

const { falarFalso, pararFalso, leituraFalsa } = vi.hoisted(() => ({
  falarFalso: vi.fn(),
  pararFalso: vi.fn(),
  leituraFalsa: vi.fn(),
}))

vi.mock('../hooks/useLeituraEmVoz', () => ({
  useLeituraEmVoz: leituraFalsa,
}))

function renderizarBarra() {
  return render(
    <AcessibilidadeProvider>
      <BarraAcessibilidade />
    </AcessibilidadeProvider>,
  )
}

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()

  leituraFalsa.mockReturnValue({
    suportado: true,
    falando: false,
    falar: falarFalso,
    parar: pararFalso,
  })
})

afterEach(() => {
  document.documentElement.dataset.fonte = ''
  document.documentElement.dataset.leitura = ''
  document.documentElement.dataset.contraste = ''
  document.getElementById('conteudo')?.remove()
})

describe('BarraAcessibilidade', () => {
  it('apresenta os controles de acessibilidade', () => {
    renderizarBarra()

    expect(
      screen.getByRole('group', { name: /recursos de acessibilidade/i }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /aumentar letra/i }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /diminuir letra/i }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /leitura fácil/i }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /alto contraste/i }),
    ).toBeInTheDocument()
  })

  it('aumenta e diminui o tamanho da fonte', () => {
    renderizarBarra()

    const aumentar = screen.getByRole('button', {
      name: /aumentar letra/i,
    })

    const diminuir = screen.getByRole('button', {
      name: /diminuir letra/i,
    })

    expect(diminuir).toBeDisabled()
    expect(screen.getByText('Letra: normal')).toBeInTheDocument()

    fireEvent.click(aumentar)

    expect(screen.getByText('Letra: grande')).toBeInTheDocument()
    expect(document.documentElement.dataset.fonte).toBe('grande')

    fireEvent.click(aumentar)

    expect(screen.getByText('Letra: maior')).toBeInTheDocument()
    expect(aumentar).toBeDisabled()

    fireEvent.click(diminuir)

    expect(screen.getByText('Letra: grande')).toBeInTheDocument()
  })

  it('ativa e desativa o modo de leitura facil', () => {
    renderizarBarra()

    const botao = screen.getByRole('button', {
      name: /leitura fácil/i,
    })

    expect(botao).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(botao)

    expect(botao).toHaveAttribute('aria-pressed', 'true')
    expect(document.documentElement.dataset.leitura).toBe('facil')
    expect(localStorage.getItem('larouaye:facil')).toBe('1')

    fireEvent.click(botao)

    expect(botao).toHaveAttribute('aria-pressed', 'false')
    expect(localStorage.getItem('larouaye:facil')).toBe('0')
  })

  it('ativa e desativa o alto contraste', () => {
    renderizarBarra()

    const botao = screen.getByRole('button', {
      name: /alto contraste/i,
    })

    expect(botao).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(botao)

    expect(botao).toHaveAttribute('aria-pressed', 'true')
    expect(document.documentElement.dataset.contraste).toBe('alto')
    expect(localStorage.getItem('larouaye:contraste')).toBe('1')

    fireEvent.click(botao)

    expect(botao).toHaveAttribute('aria-pressed', 'false')
    expect(document.documentElement.dataset.contraste).toBe('')
  })

  it('envia o conteudo da pagina para leitura em voz alta', () => {
    const conteudo = document.createElement('main')
    conteudo.id = 'conteudo'
    conteudo.innerText = 'Orientações para comprar seu imóvel.'
    document.body.appendChild(conteudo)

    renderizarBarra()

    fireEvent.click(
      screen.getByRole('button', { name: /ouvir esta página/i }),
    )

    expect(falarFalso).toHaveBeenCalledWith(
      'Orientações para comprar seu imóvel.',
    )
  })

  it('permite interromper a leitura em andamento', () => {
    leituraFalsa.mockReturnValue({
      suportado: true,
      falando: true,
      falar: falarFalso,
      parar: pararFalso,
    })

    renderizarBarra()

    const botao = screen.getByRole('button', {
      name: /parar a leitura/i,
    })

    expect(botao).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(botao)

    expect(pararFalso).toHaveBeenCalledTimes(1)
    expect(falarFalso).not.toHaveBeenCalled()
  })

  it('oculta o controle de voz quando nao ha suporte', () => {
    leituraFalsa.mockReturnValue({
      suportado: false,
      falando: false,
      falar: falarFalso,
      parar: pararFalso,
    })

    renderizarBarra()

    expect(
      screen.queryByRole('button', { name: /ouvir esta página/i }),
    ).not.toBeInTheDocument()
  })
})
