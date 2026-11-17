
import { useCallback, useEffect, useState } from 'react'
import { verificarServidor } from '../services/saudeService'
import { Button } from './Button'

const ATRASO_AVISO_MS = 1500

// Faixa fixa no rodapé da tela: não ocupa lugar no fluxo da página, então não empurra o conteúdo (sem salto de layout).
const FAIXA = 'fixed inset-x-0 bottom-0 z-40 bg-white shadow-[0_-2px_8px_rgb(0_0_0/0.15)]'

type Situacao = 'verificando' | 'ok' | 'fora'

// Aviso no topo quando a API não responde. Assim a pessoa entende o que houve em vez de ver telas quebradas.
export function StatusServidor() {
  const [situacao, setSituacao] = useState<Situacao>('verificando')
  const [tentativa, setTentativa] = useState(0)
  // O aviso de "conectando" só aparece se a resposta demorar: assim ele não empurra a página para baixo
  // (e depois para cima) quando o servidor responde rápido.
  const [demorou, setDemorou] = useState(false)

  const checar = useCallback(() => {
    const c = new AbortController()
    verificarServidor(c.signal)
      .then(() => setSituacao('ok'))
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === 'AbortError') return
        // Resposta 4xx (ex.: 404 em /saude) prova que o servidor está de pé. 5xx inclui o proxy sem destino: tratamos como fora.
        const status = (e as { status?: number | null }).status
        setSituacao(typeof status === 'number' && status < 500 ? 'ok' : 'fora')
      })
    return () => c.abort()
  }, [])

  useEffect(() => checar(), [checar, tentativa])

  useEffect(() => {
    if (situacao !== 'verificando') return
    const t = setTimeout(() => setDemorou(true), ATRASO_AVISO_MS)
    return () => clearTimeout(t)
  }, [situacao, tentativa])

  if (situacao === 'ok') return null

  if (situacao === 'verificando') {
    if (!demorou) return null
    return (
      <p role="status" className={`${FAIXA} border-t-2 border-azul px-4 py-2 text-center text-base`}>
        Conectando ao servidor… na primeira vez pode demorar um pouco.
      </p>
    )
  }

  return (
    <div role="alert" className={`${FAIXA} border-t-2 border-erro px-4 py-3`}>
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
        <p className="font-semibold text-erro">
          Não conseguimos falar com o servidor agora. Algumas telas podem não funcionar.
        </p>
        <Button variante="secundario" onClick={() => {
            setSituacao('verificando')
            setDemorou(false)
            setTentativa((n) => n + 1)
          }}>
          Tentar de novo
        </Button>
      </div>
    </div>
  )
}
