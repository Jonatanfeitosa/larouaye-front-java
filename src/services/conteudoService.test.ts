import { afterEach, describe, expect, it, vi } from 'vitest'
import { respostaJson } from '../test/ajudantes'
import { listarCategorias, listarOrientacoes, listarOrientacoesDaCategoria, listarServicos } from './conteudoService'

afterEach(() => vi.unstubAllGlobals())

function chamar(fn: () => Promise<unknown>) {
  const f = vi.fn().mockResolvedValue(respostaJson([]))
  vi.stubGlobal('fetch', f)
  return fn().then(() => f.mock.calls[0][0] as string)
}

describe('conteudoService', () => {
  it('orientações: GET /orientacoes', async () => expect(await chamar(() => listarOrientacoes())).toBe('/api/orientacoes'))
  it('categorias: GET /categorias', async () => expect(await chamar(() => listarCategorias())).toBe('/api/categorias'))
  it('rota aninhada 1:N: /categorias/{id}/orientacoes', async () =>
    expect(await chamar(() => listarOrientacoesDaCategoria(4))).toBe('/api/categorias/4/orientacoes'))
  it('serviços: GET /servicos?uf=SP', async () => expect(await chamar(() => listarServicos('SP'))).toBe('/api/servicos?uf=SP'))
  it('protege a URL: codifica o parâmetro uf', async () =>
    expect(await chamar(() => listarServicos('S P&x=1'))).toBe('/api/servicos?uf=S%20P%26x%3D1'))
})
