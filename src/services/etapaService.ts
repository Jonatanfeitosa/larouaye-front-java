
import type { Etapa, ProgressoEtapa, StatusEtapa } from '../types/etapa'
import { PREFIXO_API, requisicao } from './api'

export function listarEtapas(signal?: AbortSignal) {
  return requisicao<Etapa[]>(`${PREFIXO_API}/etapas`, { signal })
}

export function listarProgresso(usuarioId: number, signal?: AbortSignal) {
  return requisicao<ProgressoEtapa[]>(`${PREFIXO_API}/usuarios/${usuarioId}/etapas`, { signal })
}

// Persiste o status no banco (via Java). O estado local do React é só espelho do que o servidor confirmou.
export function salvarProgresso(usuarioId: number, etapaId: number, status: StatusEtapa) {
  return requisicao<ProgressoEtapa>(`${PREFIXO_API}/usuarios/${usuarioId}/etapas`, {
    metodo: 'POST',
    corpo: { etapaId, status },
  })
}
