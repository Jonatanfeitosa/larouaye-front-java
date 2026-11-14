import type { BaseLegal } from './orientacao'

export interface ConsultaRequisicao {
  pergunta: string
  uf: string
  etapa: string
}

// Formato do "Etapa 9" do plano técnico de integração. O front decide o que mostrar
// pela PRESENÇA de `resposta` e pelo `status`, nunca pela confiança do classificador.
export interface ConsultaResposta {
  consultaId: number
  status: string
  categoria?: string
  resposta?: {
    titulo: string
    conteudo: string
    cuidados?: string[]
    baseLegal?: BaseLegal[]
    dataRevisao?: string
  }
  proximaEtapa?: string
  // Quando o Java pede esclarecimento (confiança intermediária): categorias para escolher
  opcoes?: string[]
}

export interface ConsultaHistorico {
  consultaId: number
  pergunta: string
  categoria?: string
  dataConsulta?: string
}
