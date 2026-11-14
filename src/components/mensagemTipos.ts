import type { BaseLegal } from '../types/orientacao'

export interface MensagemUsuario {
  id: number
  autor: 'usuario'
  texto: string
}

export interface MensagemAssistente {
  id: number
  autor: 'assistente'
  titulo?: string
  texto: string
  cuidados?: string[]
  baseLegal?: BaseLegal[]
  dataRevisao?: string
  proximaEtapa?: string
  opcoes?: string[]
}

export type Mensagem = MensagemUsuario | MensagemAssistente

export interface Voz {
  suportado: boolean
  falando: boolean
  falar: (texto: string) => void
  parar: () => void
}

export function textoParaVoz(m: MensagemAssistente): string {
  return [m.titulo, m.texto, ...(m.cuidados ?? [])].filter(Boolean).join('. ')
}

