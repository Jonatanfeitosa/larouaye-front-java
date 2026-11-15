
import { useCallback, useState } from 'react'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { ErroMensagem } from '../components/ErroMensagem'
import { EstadoVazio } from '../components/EstadoVazio'
import { IdentificacaoUsuario } from '../components/IdentificacaoUsuario'
import { SkeletonCard, SkeletonCarregando } from '../components/Skeleton'
import { useUsuario } from '../contexts/UsuarioContext'
import { useCarregamento } from '../hooks/useCarregamento'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { listarEtapas, listarProgresso, salvarProgresso } from '../services/etapaService'
import type { Etapa, ProgressoEtapa, StatusEtapa } from '../types/etapa'

const ROTULO: Record<StatusEtapa, string> = {
  PENDENTE: 'Ainda não comecei',
  EM_ANDAMENTO: 'Em andamento',
  CONCLUIDA: 'Concluída',
}

interface Dados {
  etapas: Etapa[]
  progresso: ProgressoEtapa[]
}

const semEtapas = (d: Dados) => d.etapas.length === 0

function Lista({ usuarioId, dados }: { usuarioId: number; dados: Dados }) {
  // Lista é remontada a cada recarga (passa pelo skeleton), então basta inicializar uma vez.
  const [status, setStatus] = useState<Record<number, StatusEtapa>>(() =>
    Object.fromEntries(dados.progresso.map((p) => [p.etapaId, p.status])),
  )
  const [salvando, setSalvando] = useState<number | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [aviso, setAviso] = useState('')

  async function mudar(etapa: Etapa, novo: StatusEtapa) {
    setErro(null)
    setSalvando(etapa.id)
    try {
      // Escrita real: só atualiza a tela depois que o servidor confirmou.
      const r = await salvarProgresso(usuarioId, etapa.id, novo)
      setStatus((s) => ({ ...s, [etapa.id]: r?.status ?? novo }))
      setAviso(`Etapa ${etapa.nome} marcada como: ${ROTULO[novo]}.`)
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível salvar.')
    } finally {
      setSalvando(null)
    }
  }

  const concluidas = dados.etapas.filter((e) => status[e.id] === 'CONCLUIDA').length

  return (
    <>
      <p className="mt-2 text-lg" role="status">
        {concluidas} de {dados.etapas.length} etapas concluídas.
      </p>
      <p className="sr-only" role="status" aria-live="polite">
        {aviso}
      </p>
      {erro && (
        <p role="alert" className="mt-3 rounded-xl border-2 border-erro bg-white p-3 font-semibold text-erro">
          {erro}
        </p>
      )}
      <ol className="mt-4 space-y-4">
        {[...dados.etapas]
          .sort((a, b) => a.ordem - b.ordem)
          .map((e) => {
            const atual = status[e.id] ?? 'PENDENTE'
            return (
              <li key={e.id}>
                <Card>
                  <h2 className="text-xl font-bold">
                    {e.ordem}. {e.nome}
                  </h2>
                  <p className="mt-1">{e.descricao}</p>
                  {e.documentos && e.documentos.length > 0 && (
                    <>
                      <h3 className="mt-3 font-bold">Documentos</h3>
                      <ul className="list-disc pl-6">
                        {e.documentos.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  {e.cuidados && e.cuidados.length > 0 && (
                    <>
                      <h3 className="mt-3 font-bold">Cuidados</h3>
                      <ul className="list-disc pl-6">
                        {e.cuidados.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  {e.fontes && e.fontes.length > 0 && (
                    <p className="mt-3 text-base">
                      Fontes:{' '}
                      {e.fontes.map((f) => (
                        <a key={f.url} href={f.url} target="_blank" rel="noreferrer" className="mr-2 font-semibold underline">
                          {f.titulo}
                          <span className="sr-only"> (abre em nova aba)</span>
                        </a>
                      ))}
                    </p>
                  )}
                  <p className="mt-3 font-semibold">Situação: {ROTULO[atual]}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA'] as StatusEtapa[]).map((s) => (
                      <Button
                        key={s}
                        variante={atual === s ? 'primario' : 'secundario'}
                        aria-pressed={atual === s}
                        carregando={salvando === e.id}
                        onClick={() => void mudar(e, s)}
                      >
                        {ROTULO[s]}
                      </Button>
                    ))}
                  </div>
                </Card>
              </li>
            )
          })}
      </ol>
    </>
  )
}

function Conteudo({ usuarioId }: { usuarioId: number }) {
  const buscar = useCallback(
    async (signal: AbortSignal): Promise<Dados> => {
      const [etapas, progresso] = await Promise.all([listarEtapas(signal), listarProgresso(usuarioId, signal)])
      return { etapas, progresso }
    },
    [usuarioId],
  )
  const { estado, recarregar } = useCarregamento(buscar, semEtapas)

  if (estado.status === 'carregando')
    return (
      <SkeletonCarregando rotulo="Carregando sua jornada">
        <SkeletonCard />
        <SkeletonCard />
      </SkeletonCarregando>
    )
  if (estado.status === 'erro') return <ErroMensagem mensagem={estado.mensagem} onTentarNovamente={recarregar} />
  if (estado.status === 'vazio')
    return <EstadoVazio titulo="Etapas ainda não cadastradas" texto="O conteúdo da jornada ainda não está disponível." />
  return <Lista usuarioId={usuarioId} dados={estado.dados} />
}

export function Jornada() {
  useTituloPagina('Minha jornada')
  const { usuario } = useUsuario()
  return (
    <section aria-labelledby="titulo-jornada">
      <h1 id="titulo-jornada" className="text-3xl font-bold">
        Minha jornada de compra
      </h1>
      <p className="mt-2">Acompanhe cada etapa, os documentos e os cuidados. O seu progresso fica salvo.</p>
      <div className="mt-4">{usuario ? <Conteudo usuarioId={usuario.id} /> : <IdentificacaoUsuario />}</div>
    </section>
  )
}
