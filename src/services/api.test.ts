import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, requisicao } from './api'
import { respostaJson } from '../test/ajudantes'

afterEach(() => vi.unstubAllGlobals())

describe('requisicao (wrapper do fetch)', () => {
  it('faz GET e devolve o JSON', async () => {
    const fetchFalso = vi.fn().mockResolvedValue(respostaJson({ ok: true }))
    vi.stubGlobal('fetch', fetchFalso)
    await expect(requisicao<{ ok: boolean }>('/api/x')).resolves.toEqual({ ok: true })
    expect(fetchFalso.mock.calls[0][1].method).toBe('GET')
  })

  it('envia o corpo como JSON no POST', async () => {
    const fetchFalso = vi.fn().mockResolvedValue(respostaJson({ id: 1 }, 201))
    vi.stubGlobal('fetch', fetchFalso)
    await requisicao('/api/x', { metodo: 'POST', corpo: { nome: 'Ana' } })
    const opcoes = fetchFalso.mock.calls[0][1]
    expect(opcoes.method).toBe('POST')
    expect(opcoes.body).toBe('{"nome":"Ana"}')
    expect(opcoes.headers['Content-Type']).toBe('application/json')
  })

  it('trata 204 sem tentar ler corpo', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respostaJson(null, 204)))
    await expect(requisicao('/api/x', { metodo: 'DELETE' })).resolves.toBeUndefined()
  })

  it('lê a mensagem do Java (mensagem, message e mapa de campos)', async () => {
    for (const [corpo, esperado] of [
      [{ mensagem: 'Nome obrigatório' }, 'Nome obrigatório'],
      [{ message: 'Bad request' }, 'Bad request'],
      [{ nome: 'Nome obrigatório', email: 'E-mail inválido' }, 'Nome obrigatório E-mail inválido'],
    ] as const) {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respostaJson(corpo, 400)))
      await expect(requisicao('/api/x')).rejects.toMatchObject({ message: esperado, status: 400 })
    }
  })

  it('usa mensagem amigável quando o erro não tem JSON', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('erro', { status: 500 })))
    await expect(requisicao('/api/x')).rejects.toMatchObject({
      status: 500,
      message: 'O servidor teve um problema. Tente de novo em alguns instantes.',
    })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 404 })))
    await expect(requisicao('/api/x')).rejects.toMatchObject({ status: 404, message: 'Não encontramos o que você procurou.' })
  })

  it('transforma falha de rede em ApiError sem status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    const erro = await requisicao('/api/x').catch((e: unknown) => e)
    expect(erro).toBeInstanceOf(ApiError)
    expect((erro as ApiError).status).toBeNull()
  })

  it('repassa o cancelamento voluntário (AbortError) sem virar erro de rede', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new DOMException('cancelado', 'AbortError')))
    await expect(requisicao('/api/x')).rejects.toMatchObject({ name: 'AbortError' })
  })
})
