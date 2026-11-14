
import { PREFIXO_API, requisicao } from './api'

export function verificarServidor(signal?: AbortSignal) {
  return requisicao<unknown>(`${PREFIXO_API}/saude`, { signal })
}
