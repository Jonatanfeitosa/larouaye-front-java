
export type StatusEtapa = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA'

export interface FonteOficial {
  titulo: string
  url: string
}

// Etapa da aquisição (GET /etapas). Conteúdo jurídico vem do Java/Oracle.
export interface Etapa {
  id: number
  codigo: string
  ordem: number
  nome: string
  descricao: string
  documentos?: string[]
  cuidados?: string[]
  duvidas?: string[]
  fontes?: FonteOficial[]
}

export interface ProgressoEtapa {
  etapaId: number
  status: StatusEtapa
}
