
import { afterEach, describe, expect, it, vi } from 'vitest'
import { respostaJson } from '../test/ajudantes'
import { listarEtapas, listarProgresso, salvarProgresso } from './etapaService'

afterEach(() => vi.unstubAllGlobals())

describe('etapaService', () => {
  it('lista as etapas da compra pela API', async () => {
    const etapas = [
      {
        id: 1,
        codigo: 'PESQUISA_IMOVEL',
        ordem: 1,
        nome: 'Pesquisa do imóvel',
        descricao: 'Encontre o imóvel adequado.',
      },
    ]

    const fetchFalso = vi.fn().mockResolvedValue(respostaJson(etapas))
    vi.stubGlobal('fetch', fetchFalso)

    await expect(listarEtapas()).resolves.toEqual(etapas)

    expect(fetchFalso).toHaveBeenCalledTimes(1)
    expect(fetchFalso.mock.calls[0][0]).toBe('/api/etapas')
    expect(fetchFalso.mock.calls[0][1].method).toBe('GET')
  })

  it('consulta o progresso das etapas de um usuário', async () => {
    const progresso = [
      { etapaId: 1, status: 'CONCLUIDA' },
      { etapaId: 2, status: 'PENDENTE' },
    ]

    const fetchFalso = vi.fn().mockResolvedValue(respostaJson(progresso))
    vi.stubGlobal('fetch', fetchFalso)

    await expect(listarProgresso(10)).resolves.toEqual(progresso)

    expect(fetchFalso).toHaveBeenCalledTimes(1)
    expect(fetchFalso.mock.calls[0][0]).toBe('/api/usuarios/10/etapas')
    expect(fetchFalso.mock.calls[0][1].method).toBe('GET')
  })

  it('salva o progresso de uma etapa usando POST', async () => {
    const progresso = { etapaId: 2, status: 'EM_ANDAMENTO' }

    const fetchFalso = vi.fn().mockResolvedValue(respostaJson(progresso))
    vi.stubGlobal('fetch', fetchFalso)

    await expect(
      salvarProgresso(10, 2, 'EM_ANDAMENTO'),
    ).resolves.toEqual(progresso)

    expect(fetchFalso).toHaveBeenCalledTimes(1)
    expect(fetchFalso.mock.calls[0][0]).toBe('/api/usuarios/10/etapas')

    const opcoes = fetchFalso.mock.calls[0][1]

    expect(opcoes.method).toBe('POST')
    expect(opcoes.body).toBe(
      JSON.stringify({ etapaId: 2, status: 'EM_ANDAMENTO' }),
    )
    expect(opcoes.headers['Content-Type']).toBe('application/json')
  })

  it('repassa o erro quando a API não responde', async () => {
    const fetchFalso = vi.fn().mockRejectedValue(
      new TypeError('Failed to fetch'),
    )
    vi.stubGlobal('fetch', fetchFalso)

    await expect(listarEtapas()).rejects.toMatchObject({
      name: 'ApiError',
      status: null,
    })
  })

  it('repassa o erro HTTP retornado pelo servidor', async () => {
    const fetchFalso = vi.fn().mockResolvedValue(
      respostaJson({ mensagem: 'Erro interno' }, 500),
    )
    vi.stubGlobal('fetch', fetchFalso)

    await expect(listarEtapas()).rejects.toMatchObject({
      name: 'ApiError',
      status: 500,
      message: 'Erro interno',
    })
  })
})
