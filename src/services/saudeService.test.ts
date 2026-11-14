
import { afterEach, describe, expect, it, vi } from 'vitest'
import { respostaJson } from '../test/ajudantes'
import { verificarServidor } from './saudeService'

afterEach(() => vi.unstubAllGlobals())

describe('saudeService', () => {
  it('consulta o endpoint de saude da API por GET', async () => {
    const fetchFalso = vi.fn().mockResolvedValue(
      respostaJson({ status: 'UP' }),
    )
    vi.stubGlobal('fetch', fetchFalso)

    await expect(verificarServidor()).resolves.toEqual({
      status: 'UP',
    })

    expect(fetchFalso).toHaveBeenCalledTimes(1)
    expect(fetchFalso.mock.calls[0][0]).toBe('/api/saude')
    expect(fetchFalso.mock.calls[0][1].method).toBe('GET')
  })

  it('repassa o signal para permitir cancelamento', async () => {
    const controlador = new AbortController()
    const fetchFalso = vi.fn().mockResolvedValue(
      respostaJson({ status: 'UP' }),
    )
    vi.stubGlobal('fetch', fetchFalso)

    await verificarServidor(controlador.signal)

    const opcoes = fetchFalso.mock.calls[0][1]

    expect(opcoes.signal).toBeInstanceOf(AbortSignal)

    controlador.abort()

    expect(opcoes.signal.aborted).toBe(true)
  })

  it('reconhece resposta HTTP 404 como erro da requisicao', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        respostaJson({ mensagem: 'Rota inexistente' }, 404),
      ),
    )

    await expect(verificarServidor()).rejects.toMatchObject({
      name: 'ApiError',
      status: 404,
      message: 'Rota inexistente',
    })
  })

  it('repassa erro HTTP 500 quando o servidor apresenta falha', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        respostaJson({ mensagem: 'Servidor indisponivel' }, 500),
      ),
    )

    await expect(verificarServidor()).rejects.toMatchObject({
      name: 'ApiError',
      status: 500,
      message: 'Servidor indisponivel',
    })
  })

  it('trata falha de rede como erro de comunicacao', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('Failed to fetch')),
    )

    await expect(verificarServidor()).rejects.toMatchObject({
      name: 'ApiError',
      status: null,
    })
  })

  it('preserva o cancelamento voluntario da requisicao', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(
        new DOMException('Requisicao cancelada', 'AbortError'),
      ),
    )

    await expect(verificarServidor()).rejects.toMatchObject({
      name: 'AbortError',
    })
  })
})
