import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderNaRota, respostaJson } from '../test/ajudantes'
import { Faq } from './Faq'

const orientacoes = [
  { id: 1, titulo: 'Dívidas do imóvel', perguntaRelacionada: 'Como descubro se um imóvel tem dívidas?', conteudo: 'Peça a certidão.', baseLegal: [{ norma: 'Lei 6.015/1973' }] },
  { id: 2, titulo: 'Matrícula', perguntaRelacionada: 'O que é a matrícula?', conteudo: 'É o documento do imóvel.' },
]

afterEach(() => vi.unstubAllGlobals())

describe('Faq (4 estados de tela)', () => {
  it('carregando: mostra skeleton com aviso para leitor de tela', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})))
    renderNaRota(<Faq />)
    expect(screen.getByRole('status', { name: '' })).toHaveAttribute('aria-busy', 'true')
  })

  it('sucesso: lista as perguntas e abre/fecha a resposta (aria-expanded)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respostaJson(orientacoes)))
    renderNaRota(<Faq />)
    const botao = await screen.findByRole('button', { name: 'O que é a matrícula?' })
    expect(botao).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(botao)
    expect(botao).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('É o documento do imóvel.')).toBeInTheDocument()
  })

  it('mostra a base legal quando existe', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respostaJson(orientacoes)))
    renderNaRota(<Faq />)
    await userEvent.click(await screen.findByRole('button', { name: /dívidas/i }))
    expect(screen.getByText(/Lei 6.015\/1973/)).toBeInTheDocument()
  })

  it('mostra cuidados, link da fonte, data de revisão e o aviso de informação geral', async () => {
    const o = [{ id: 3, titulo: 'Consórcio', perguntaRelacionada: 'Como funciona o consórcio?', conteudo: 'Grupo que paga todo mês.', cuidados: ['Confira a administradora'], baseLegal: [{ norma: 'Lei 11.795/2008', url: 'https://exemplo.gov.br/lei' }], dataRevisao: '17/11/2026' }]
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respostaJson(o)))
    renderNaRota(<Faq />)
    await userEvent.click(await screen.findByRole('button', { name: /consórcio/i }))
    expect(screen.getByText('Confira a administradora')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Lei 11.795\/2008/ })).toHaveAttribute('href', 'https://exemplo.gov.br/lei')
    expect(screen.getByText(/Revisado em 17\/11\/2026/)).toBeInTheDocument()
    expect(screen.getByText(/não substitui um advogado/)).toBeInTheDocument()
  })

  it('busca filtra e anuncia a quantidade; sem resultado oferece limpar', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respostaJson(orientacoes)))
    renderNaRota(<Faq />)
    await screen.findByRole('button', { name: /matrícula/i })
    await userEvent.type(screen.getByLabelText('Buscar uma dúvida'), 'matrícula')
    expect(screen.getByText('1 resultado')).toBeInTheDocument()
    await userEvent.clear(screen.getByLabelText('Buscar uma dúvida'))
    await userEvent.type(screen.getByLabelText('Buscar uma dúvida'), 'zzzz')
    expect(screen.getByText('Nada encontrado')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Limpar busca' }))
    expect(screen.getByText('2 resultados')).toBeInTheDocument()
  })

  it('erro: alerta com tentar de novo que busca outra vez', async () => {
    const f = vi.fn().mockResolvedValueOnce(respostaJson({}, 500)).mockResolvedValueOnce(respostaJson(orientacoes))
    vi.stubGlobal('fetch', f)
    renderNaRota(<Faq />)
    expect(await screen.findByRole('alert')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /tentar de novo/i }))
    expect(await screen.findByRole('button', { name: /matrícula/i })).toBeInTheDocument()
  })

  it('vazio: explica que o conteúdo está sendo preparado', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respostaJson([])))
    renderNaRota(<Faq />)
    expect(await screen.findByText('Ainda não há orientações')).toBeInTheDocument()
  })
})
