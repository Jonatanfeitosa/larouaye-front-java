
import { useCallback, useEffect, useState } from 'react'
import { verificarServidor } from '../services/saudeService'
import { Button } from './Button'

type Situacao = 'verificando' | 'ok' | 'fora'

// Aviso no topo quando a API não responde. Assim a pessoa entende o que houve em vez de ver telas quebradas.
export function StatusServidor() {
  const [situacao, setSituacao] = useState<Situacao>('verificando')
  const [tentativa, setTentativa] = useState(0)

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

  if (situacao === 'ok') return null

  if (situacao === 'verificando')
    return (
      <p role="status" className="bg-white px-4 py-2 text-center text-base">
        Conectando ao servidor… na primeira vez pode demorar um pouco.
      </p>
    )

  return (
    <div role="alert" className="border-b-2 border-erro bg-white px-4 py-3">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
        <p className="font-semibold text-erro">
          Não conseguimos falar com o servidor agora. Algumas telas podem não funcionar.
        </p>
        <Button variante="secundario" onClick={() => {
            setSituacao('verificando')
            setTentativa((n) => n + 1)
          }}>
          Tentar de novo
        </Button>
      </div>
    </div>
  )
}
