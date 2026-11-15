import type { ConsultaHistorico, ConsultaRequisicao, ConsultaResposta } from '../types/consulta'
import { PREFIXO_API, requisicao } from './api'

export function enviarConsulta(usuarioId: number, dados: ConsultaRequisicao, signal?: AbortSignal) {
  return requisicao<ConsultaResposta>(`${PREFIXO_API}/usuarios/${usuarioId}/consultas`, {
    metodo: 'POST',
    corpo: dados,
    signal,
  })
}

export function listarHistorico(usuarioId: number, signal?: AbortSignal) {
  return requisicao<ConsultaHistorico[]>(`${PREFIXO_API}/usuarios/${usuarioId}/consultas`, { signal })
}
