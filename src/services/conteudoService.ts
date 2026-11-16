import type { Categoria, Orientacao } from '../types/orientacao'
import type { Servico } from '../types/servico'
import { PREFIXO_API, requisicao } from './api'

export const listarOrientacoes = (signal?: AbortSignal) =>
  requisicao<Orientacao[]>(`${PREFIXO_API}/orientacoes`, { signal })

export const listarCategorias = (signal?: AbortSignal) =>
  requisicao<Categoria[]>(`${PREFIXO_API}/categorias`, { signal })

// Rota aninhada 1:N exigida na disciplina Java
export const listarOrientacoesDaCategoria = (categoriaId: number, signal?: AbortSignal) =>
  requisicao<Orientacao[]>(`${PREFIXO_API}/categorias/${categoriaId}/orientacoes`, { signal })

export const listarServicos = (uf: string, signal?: AbortSignal) =>
  requisicao<Servico[]>(`${PREFIXO_API}/servicos?uf=${encodeURIComponent(uf)}`, { signal })
