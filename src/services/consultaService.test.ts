import { afterEach, describe, expect, it, vi } from 'vitest'
import { respostaJson } from '../test/ajudantes'
import { enviarConsulta, listarHistorico } from './consultaService'

afterEach(() => vi.unstubAllGlobals())

describe('consultaService', () => {
  it('enviarConsulta faz POST em /usuarios/{id}/consultas com o corpo', async () => {
    const f = vi.fn().mockResolvedValue(respostaJson({ consultaId: 1, status: 'RESPONDIDA' }, 201))
    vi.stubGlobal('fetch', f)
    const dados = { pergunta: 'Como verificar dívidas?', uf: 'SP', etapa: 'ANALISE_DOCUMENTAL' }
    await enviarConsulta(5, dados)
    expect(f.mock.calls[0][0]).toBe('/api/usuarios/5/consultas')
    expect(f.mock.calls[0][1].method).toBe('POST')
    expect(JSON.parse(f.mock.calls[0][1].body)).toEqual(dados)
  })

  it('listarHistorico faz GET na mesma rota', async () => {
    const f = vi.fn().mockResolvedValue(respostaJson([]))
    vi.stubGlobal('fetch', f)
    await listarHistorico(5)
    expect(f.mock.calls[0][0]).toBe('/api/usuarios/5/consultas')
    expect(f.mock.calls[0][1].method).toBe('GET')
  })
})
