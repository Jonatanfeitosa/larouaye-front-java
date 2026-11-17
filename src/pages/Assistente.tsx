import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Aviso } from '../components/Aviso'
import { Button } from '../components/Button'
import { CampoAreaTexto } from '../components/CampoAreaTexto'
import { CampoSelect } from '../components/CampoSelect'
import { Card } from '../components/Card'
import { ErroMensagem } from '../components/ErroMensagem'
import { EstadoVazio } from '../components/EstadoVazio'
import { IdentificacaoUsuario } from '../components/IdentificacaoUsuario'
import { Casinha } from '../components/Casinha'
import { MensagemChat } from '../components/MensagemChat'
import { textoParaVoz, type Mensagem } from '../components/mensagemTipos'
import { ResumoErros } from '../components/ResumoErros'
import { Skeleton, SkeletonCarregando } from '../components/Skeleton'
import { useUsuario } from '../contexts/UsuarioContext'
import { ETAPAS_COMPRA, OPCOES_UF } from '../data/opcoes'
import { useCarregamento } from '../hooks/useCarregamento'
import { useLeituraEmVoz } from '../hooks/useLeituraEmVoz'
import { useReconhecimentoVoz } from '../hooks/useReconhecimentoVoz'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { consultaSchema, type ConsultaDados } from '../schemas/consultaSchema'
import { enviarConsulta, listarHistorico } from '../services/consultaService'
import type { ConsultaHistorico } from '../types/consulta'

const PERGUNTAS_PRONTAS = [
  { emoji: '🔎', texto: 'Como descubro se um imóvel tem dívidas?' },
  { emoji: '📄', texto: 'Quais documentos o vendedor precisa me mostrar?' },
  { emoji: '🏷️', texto: 'O que é a matrícula do imóvel?' },
  { emoji: '✍️', texto: 'Qual a diferença entre escritura e registro?' },
]

const SAUDACAO = 'Oi, eu sou a Casinha. Pode falar ou escolher uma pergunta pronta. Eu explico com calma.'

const semHistorico = (d: ConsultaHistorico[]) => d.length === 0

function Historico({ usuarioId }: { usuarioId: number }) {
  const buscar = useCallback((signal: AbortSignal) => listarHistorico(usuarioId, signal), [usuarioId])
  const { estado, recarregar } = useCarregamento(buscar, semHistorico)

  if (estado.status === 'carregando')
    return (
      <SkeletonCarregando rotulo="Carregando seu histórico">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
      </SkeletonCarregando>
    )
  if (estado.status === 'erro') return <ErroMensagem titulo="Não foi possível abrir o histórico" mensagem={estado.mensagem} onTentarNovamente={recarregar} />
  if (estado.status === 'vazio') return <EstadoVazio titulo="Nenhuma pergunta ainda" texto="Suas perguntas aparecerão aqui." />
  return (
    <ul className="space-y-2">
      {estado.dados.map((c) => (
        <li key={c.consultaId} className="rounded-xl border border-azul/20 bg-white p-3">
          <p className="font-semibold">{c.pergunta}</p>
          <p className="text-base">
            {c.categoria ?? 'Sem categoria'}
            {c.dataConsulta ? ` · ${c.dataConsulta}` : ''}
          </p>
        </li>
      ))}
    </ul>
  )
}

export function Assistente() {
  useTituloPagina('Assistente')
  const { usuario, sair } = useUsuario()
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [ultima, setUltima] = useState<ConsultaDados | null>(null)
  const [tentativas, setTentativas] = useState(0)
  const [verHistorico, setVerHistorico] = useState(false)
  const proximoId = useRef(1)
  const voz = useLeituraEmVoz()
  const [autoFalar, setAutoFalar] = useState(true)
  const fimRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ConsultaDados>({
    resolver: zodResolver(consultaSchema),
    defaultValues: { pergunta: '' },
    shouldFocusError: false,
  })
  const mic = useReconhecimentoVoz((texto) => setValue('pergunta', texto, { shouldValidate: true }))
  const itens = Object.entries(errors).map(([campo, e]) => ({ campo, mensagem: e?.message ?? '' }))

  useEffect(() => {
    fimRef.current?.scrollIntoView({ block: 'nearest' })
  }, [mensagens, enviando])

  // A Casinha lê a resposta nova em voz alta (a pessoa pode desligar).
  const ultimaMensagem = mensagens[mensagens.length - 1]
  const { falar } = voz
  useEffect(() => {
    if (autoFalar && ultimaMensagem?.autor === 'assistente') falar(textoParaVoz(ultimaMensagem))
  }, [ultimaMensagem, autoFalar, falar])

  const executar = useCallback(
    async (dados: ConsultaDados) => {
      if (!usuario) return
      setErro(null)
      setEnviando(true)
      setUltima(dados)
      setMensagens((ms) => [...ms, { id: proximoId.current++, autor: 'usuario', texto: dados.pergunta }])
      try {
        const r = await enviarConsulta(usuario.id, dados)
        // O front decide pelo que o Java devolveu (resposta/opções), nunca pela confiança do classificador.
        if (r.resposta) {
          setMensagens((ms) => [
            ...ms,
            {
              id: proximoId.current++,
              autor: 'assistente',
              titulo: r.resposta!.titulo,
              texto: r.resposta!.conteudo,
              cuidados: r.resposta!.cuidados,
              baseLegal: r.resposta!.baseLegal,
              dataRevisao: r.resposta!.dataRevisao,
              proximaEtapa: r.proximaEtapa,
            },
          ])
        } else if (r.opcoes && r.opcoes.length > 0) {
          setMensagens((ms) => [
            ...ms,
            {
              id: proximoId.current++,
              autor: 'assistente',
              texto: 'Não tenho certeza do que você quer saber. Sua dúvida é sobre algum destes assuntos? Reescreva a pergunta citando um deles.',
              opcoes: r.opcoes,
            },
          ])
        } else {
          setMensagens((ms) => [
            ...ms,
            {
              id: proximoId.current++,
              autor: 'assistente',
              texto: 'Ainda não tenho uma orientação segura para essa pergunta. Tente reescrever com outras palavras, veja as Dúvidas frequentes ou procure um advogado, o cartório ou a Defensoria Pública.',
            },
          ])
        }
        reset({ pergunta: '', uf: dados.uf, etapa: dados.etapa })
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Não foi possível enviar. Tente de novo.')
      } finally {
        setEnviando(false)
      }
    },
    [usuario, reset],
  )

  if (!usuario) {
    return (
      <section aria-labelledby="titulo-assistente" className="mx-auto max-w-xl space-y-4">
        <h1 id="titulo-assistente" className="text-3xl font-bold">
          Assistente jurídico
        </h1>
        <IdentificacaoUsuario />
      </section>
    )
  }

  return (
    <section aria-labelledby="titulo-assistente" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 id="titulo-assistente" className="text-3xl font-bold">
          Assistente jurídico
        </h1>
        <p>
          Olá, <strong>{usuario.nome}</strong>.{' '}
          <button type="button" className="min-h-11 font-semibold underline" onClick={sair}>
            Não sou eu
          </button>
        </p>
      </div>
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-4 sm:flex-row">
        <Casinha falando={voz.falando} pensando={enviando} className="h-28 w-28 shrink-0" />
        <div>
          <p className="text-lg font-semibold">{SAUDACAO}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {voz.suportado && (
              <Button variante="secundario" onClick={() => voz.falar(SAUDACAO)}>
                🔊 Ouvir a Casinha
              </Button>
            )}
            <Button variante="secundario" aria-pressed={autoFalar} onClick={() => setAutoFalar((v) => !v)}>
              {autoFalar ? 'Respostas faladas: ligado' : 'Respostas faladas: desligado'}
            </Button>
          </div>
        </div>
      </div>
      <Aviso />

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div>
          <Card>
            <h2 className="sr-only">Conversa</h2>
            {mensagens.length === 0 && !enviando ? (
              <div>
                <p className="text-lg font-semibold">Pergunte do seu jeito. Ou escolha uma pergunta pronta:</p>
                <ul className="mt-3 flex flex-col gap-2">
                  {PERGUNTAS_PRONTAS.map((p) => (
                    <li key={p.texto}>
                      <button
                        type="button"
                        className="flex min-h-16 w-full items-center gap-3 rounded-xl border-2 border-azul p-3 text-left text-lg font-semibold hover:bg-cinza"
                        onClick={() => {
                          setValue('pergunta', p.texto, { shouldValidate: true })
                          document.getElementById('pergunta')?.focus()
                        }}
                      >
                        <span aria-hidden="true" className="text-3xl">
                          {p.emoji}
                        </span>
                        {p.texto}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <ol className="flex max-h-[28rem] flex-col gap-3 overflow-y-auto" aria-live="polite">
                {mensagens.map((m) => (
                  <MensagemChat key={m.id} mensagem={m} voz={voz} />
                ))}
                {enviando && (
                  <li role="status" className="mr-auto rounded-2xl border-2 border-azul bg-white p-4">
                    <span className="sr-only">A Casinha está preparando a resposta</span>
                    <span aria-hidden="true">A Casinha está pensando…</span>
                  </li>
                )}
                <div ref={fimRef} />
              </ol>
            )}
            {mensagens.length > 0 && (
              <Button className="mt-3" variante="secundario" onClick={() => setMensagens([])}>
                Limpar conversa
              </Button>
            )}
          </Card>

          {erro && (
            <div className="mt-4">
              <ErroMensagem
                titulo="Não foi possível enviar"
                mensagem={erro}
                onTentarNovamente={ultima ? () => void executar(ultima) : undefined}
              />
            </div>
          )}

          <Card className="mt-4">
            <form
              noValidate
              className="space-y-4"
              onSubmit={handleSubmit(executar, () => setTentativas((n) => n + 1))}
            >
              {itens.length > 0 && <ResumoErros key={tentativas} itens={itens} />}
              <div className="grid gap-4 sm:grid-cols-2">
                <CampoSelect id="uf" rotulo="Seu estado" opcoes={OPCOES_UF} erro={errors.uf?.message} {...register('uf')} />
                <CampoSelect id="etapa" rotulo="Etapa da compra" opcoes={ETAPAS_COMPRA} erro={errors.etapa?.message} {...register('etapa')} />
              </div>
              <CampoAreaTexto
                id="pergunta"
                rotulo="Sua pergunta"
                rows={3}
                ajuda="Não escreva CPF nem dados de conta."
                erro={errors.pergunta?.message}
                {...register('pergunta')}
              />
              <div className="flex flex-wrap gap-2">
                {mic.suportado && (
                  <Button variante="secundario" aria-pressed={mic.ouvindo} onClick={mic.ouvindo ? mic.parar : mic.ouvir}>
                    {mic.ouvindo ? '⏹ Parar de ouvir' : '🎤 Falar minha pergunta'}
                  </Button>
                )}
                <Button type="submit" carregando={enviando}>
                  {enviando ? 'Enviando…' : 'Enviar pergunta'}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <aside aria-labelledby="titulo-historico">
          <h2 id="titulo-historico" className="text-xl font-bold">
            Meu histórico
          </h2>
          {verHistorico ? (
            <div className="mt-3">
              <Historico usuarioId={usuario.id} />
            </div>
          ) : (
            <Button className="mt-3" variante="secundario" onClick={() => setVerHistorico(true)}>
              Ver minhas perguntas
            </Button>
          )}
        </aside>
      </div>
    </section>
  )
}
