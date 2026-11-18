import { useCallback, useMemo, useState } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ErroMensagem } from '../components/ErroMensagem'
import { EstadoVazio } from '../components/EstadoVazio'
import { SkeletonCard, SkeletonCarregando } from '../components/Skeleton'
import { useCarregamento } from '../hooks/useCarregamento'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { listarOrientacoes } from '../services/conteudoService'
import type { Orientacao } from '../types/orientacao'

const semItens = (d: Orientacao[]) => d.length === 0

// As perguntas e respostas vêm do catálogo jurídico (API Java / Oracle). Nada de texto jurídico escrito no React.
export function Faq() {
  useTituloPagina('Dúvidas frequentes')
  const buscar = useCallback((signal: AbortSignal) => listarOrientacoes(signal), [])
  const { estado, recarregar } = useCarregamento(buscar, semItens)
  const [busca, setBusca] = useState('')
  const [aberto, setAberto] = useState<number | null>(null)

  const filtradas = useMemo(() => {
    if (estado.status !== 'sucesso') return []
    const termo = busca.trim().toLowerCase()
    return estado.dados.filter(
      (o) => !termo || `${o.titulo} ${o.perguntaRelacionada ?? ''} ${o.conteudo}`.toLowerCase().includes(termo),
    )
  }, [estado, busca])

  return (
    <section aria-labelledby="titulo-faq">
      <h1 id="titulo-faq" className="text-3xl font-bold">
        Dúvidas frequentes
      </h1>

      {estado.status === 'carregando' && (
        <div className="mt-6">
          <SkeletonCarregando rotulo="Carregando as dúvidas">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </SkeletonCarregando>
        </div>
      )}
      {estado.status === 'erro' && (
        <div className="mt-6">
          <ErroMensagem mensagem={estado.mensagem} onTentarNovamente={recarregar} />
        </div>
      )}
      {estado.status === 'vazio' && (
        <div className="mt-6">
          <EstadoVazio titulo="Ainda não há orientações" texto="Volte em breve: estamos preparando o conteúdo." />
        </div>
      )}
      {estado.status === 'sucesso' && (
        <>
          <div className="mt-4">
            <label htmlFor="busca-faq" className="block font-semibold">
              Buscar uma dúvida
            </label>
            <input
              id="busca-faq"
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="mt-1 min-h-12 w-full rounded-lg border-2 border-azul bg-white px-3"
            />
            <p className="mt-1 text-base" role="status">
              {filtradas.length} {filtradas.length === 1 ? 'resultado' : 'resultados'}
            </p>
          </div>
          {filtradas.length === 0 ? (
            <div className="mt-4">
              <EstadoVazio titulo="Nada encontrado" texto="Tente outras palavras ou limpe a busca.">
                <Button variante="secundario" onClick={() => setBusca('')}>
                  Limpar busca
                </Button>
              </EstadoVazio>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {filtradas.map((o) => {
                const aberta = aberto === o.id
                return (
                  <li key={o.id}>
                    <Card className="p-0 sm:p-0">
                      <h2 className="text-lg font-bold">
                        <button
                          type="button"
                          className="flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl p-4 text-left transition-colors hover:bg-ouro-claro motion-reduce:transition-none"
                          aria-expanded={aberta}
                          aria-controls={`faq-${o.id}`}
                          onClick={() => setAberto(aberta ? null : o.id)}
                        >
                          <span>{o.perguntaRelacionada ?? o.titulo}</span>
                          {/* Seta: mostra que a pergunta abre e fecha (decorativa; o estado vai em aria-expanded) */}
                          <span
                            aria-hidden="true"
                            className={`shrink-0 text-2xl transition-transform motion-reduce:transition-none ${aberta ? 'rotate-180' : ''}`}
                          >
                            ▾
                          </span>
                        </button>
                      </h2>
                      {aberta && (
                        <div id={`faq-${o.id}`} className="border-t border-azul/20 p-4">
                          <p className="whitespace-pre-line">{o.conteudo}</p>
                          {o.cuidados && o.cuidados.length > 0 && (
                            <>
                              <h3 className="mt-4 font-bold">Cuidados</h3>
                              <ul className="mt-1 list-disc space-y-1 pl-6">
                                {o.cuidados.map((c) => (
                                  <li key={c}>{c}</li>
                                ))}
                              </ul>
                            </>
                          )}
                          {o.baseLegal && o.baseLegal.length > 0 && (
                            <p className="mt-3 text-base">
                              <strong>Base legal:</strong>{' '}
                              {o.baseLegal.map((b, i) => (
                                <span key={b.norma}>
                                  {i > 0 && '; '}
                                  {b.url ? (
                                    <a href={b.url} target="_blank" rel="noopener noreferrer" className="underline">
                                      {b.norma}
                                      <span className="sr-only"> (abre em nova aba)</span>
                                    </a>
                                  ) : (
                                    b.norma
                                  )}
                                </span>
                              ))}
                            </p>
                          )}
                          <p className="mt-3 text-base">
                            {o.dataRevisao && <>Revisado em {o.dataRevisao}. </>}
                            Informação geral: não substitui um advogado nem o cartório.
                          </p>
                        </div>
                      )}
                    </Card>
                  </li>
                )
              })}
            </ul>
          )}
        </>
      )}
    </section>
  )
}
