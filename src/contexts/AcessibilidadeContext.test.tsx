
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import {
  AcessibilidadeProvider,
  useAcessibilidade,
} from './AcessibilidadeContext'

function ComponenteTeste() {
  const {
    fonte,
    aumentarFonte,
    diminuirFonte,
    leituraFacil,
    alternarLeituraFacil,
    altoContraste,
    alternarAltoContraste,
  } = useAcessibilidade()

  return (
    <div>
      <p>Fonte: {fonte}</p>
      <p>Leitura: {leituraFacil ? 'ativa' : 'inativa'}</p>
      <p>Contraste: {altoContraste ? 'ativo' : 'inativo'}</p>

      <button onClick={aumentarFonte}>Aumentar fonte</button>
      <button onClick={diminuirFonte}>Diminuir fonte</button>
      <button onClick={alternarLeituraFacil}>Alternar leitura</button>
      <button onClick={alternarAltoContraste}>Alternar contraste</button>
    </div>
  )
}

function renderizarContexto() {
  return render(
    <AcessibilidadeProvider>
      <ComponenteTeste />
    </AcessibilidadeProvider>,
  )
}

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  localStorage.clear()
  document.documentElement.dataset.fonte = ''
  document.documentElement.dataset.leitura = ''
  document.documentElement.dataset.contraste = ''
})

describe('AcessibilidadeContext', () => {
  it('inicia com as preferencias padrao', () => {
    renderizarContexto()

    expect(screen.getByText('Fonte: normal')).toBeInTheDocument()
    expect(screen.getByText('Leitura: inativa')).toBeInTheDocument()
    expect(screen.getByText('Contraste: inativo')).toBeInTheDocument()
  })

  it('aumenta a fonte respeitando o limite maximo', () => {
    renderizarContexto()

    const aumentar = screen.getByRole('button', {
      name: 'Aumentar fonte',
    })

    fireEvent.click(aumentar)
    expect(screen.getByText('Fonte: grande')).toBeInTheDocument()

    fireEvent.click(aumentar)
    expect(screen.getByText('Fonte: maior')).toBeInTheDocument()

    fireEvent.click(aumentar)
    expect(screen.getByText('Fonte: maior')).toBeInTheDocument()

    expect(document.documentElement.dataset.fonte).toBe('maior')
    expect(localStorage.getItem('larouaye:fonte')).toBe('maior')
  })

  it('diminui a fonte respeitando o limite minimo', () => {
    renderizarContexto()

    const aumentar = screen.getByRole('button', {
      name: 'Aumentar fonte',
    })
    const diminuir = screen.getByRole('button', {
      name: 'Diminuir fonte',
    })

    fireEvent.click(aumentar)
    fireEvent.click(aumentar)
    fireEvent.click(diminuir)

    expect(screen.getByText('Fonte: grande')).toBeInTheDocument()

    fireEvent.click(diminuir)
    fireEvent.click(diminuir)

    expect(screen.getByText('Fonte: normal')).toBeInTheDocument()
    expect(document.documentElement.dataset.fonte).toBe('')
  })

  it('ativa e desativa o modo de leitura facil', () => {
    renderizarContexto()

    const botao = screen.getByRole('button', {
      name: 'Alternar leitura',
    })

    fireEvent.click(botao)

    expect(screen.getByText('Leitura: ativa')).toBeInTheDocument()
    expect(document.documentElement.dataset.leitura).toBe('facil')
    expect(localStorage.getItem('larouaye:facil')).toBe('1')

    fireEvent.click(botao)

    expect(screen.getByText('Leitura: inativa')).toBeInTheDocument()
    expect(localStorage.getItem('larouaye:facil')).toBe('0')
  })

  it('ativa e desativa o alto contraste', () => {
    renderizarContexto()

    const botao = screen.getByRole('button', {
      name: 'Alternar contraste',
    })

    fireEvent.click(botao)

    expect(screen.getByText('Contraste: ativo')).toBeInTheDocument()
    expect(document.documentElement.dataset.contraste).toBe('alto')
    expect(localStorage.getItem('larouaye:contraste')).toBe('1')

    fireEvent.click(botao)

    expect(screen.getByText('Contraste: inativo')).toBeInTheDocument()
    expect(document.documentElement.dataset.contraste).toBe('')
  })

  it('recupera as preferencias salvas no localStorage', () => {
    localStorage.setItem('larouaye:fonte', 'grande')
    localStorage.setItem('larouaye:facil', '1')
    localStorage.setItem('larouaye:contraste', '1')

    renderizarContexto()

    expect(screen.getByText('Fonte: grande')).toBeInTheDocument()
    expect(screen.getByText('Leitura: ativa')).toBeInTheDocument()
    expect(screen.getByText('Contraste: ativo')).toBeInTheDocument()
  })

  it('ignora tamanho de fonte invalido no armazenamento', () => {
    localStorage.setItem('larouaye:fonte', 'gigante')

    renderizarContexto()

    expect(screen.getByText('Fonte: normal')).toBeInTheDocument()
    expect(localStorage.getItem('larouaye:fonte')).toBe('normal')
  })
})
