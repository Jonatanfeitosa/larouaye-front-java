import { useCallback, useEffect, useState } from 'react'

// Os 4 estados de tela do projeto: carregando (skeleton), erro (com retry),
// vazio (mensagem útil) e sucesso (dados).
export type EstadoCarregamento<T> =
  | { status: 'carregando' }
  | { status: 'erro'; mensagem: string }
  | { status: 'vazio' }
  | { status: 'sucesso'; dados: T }

// `buscar` precisa ser estável (use useCallback onde chamar) e `estaVazio`,
// se usado, deve ser uma função declarada fora do componente.
export function useCarregamento<T>(
  buscar: (signal: AbortSignal) => Promise<T>,
  estaVazio?: (dados: T) => boolean,
) {
  const [estado, setEstado] = useState<EstadoCarregamento<T>>({ status: 'carregando' })
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    const controlador = new AbortController()

    buscar(controlador.signal)
      .then((dados) => setEstado(estaVazio?.(dados) ? { status: 'vazio' } : { status: 'sucesso', dados }))
      .catch((erro: unknown) => {
        // Sair da página cancela o fetch: isso não é erro para o usuário.
        if (erro instanceof DOMException && erro.name === 'AbortError') return
        setEstado({
          status: 'erro',
          mensagem: erro instanceof Error ? erro.message : 'Algo deu errado. Tente de novo.',
        })
      })

    // Cleanup: cancela a requisição se a tela sair do ar ou a busca mudar.
    return () => controlador.abort()
  }, [buscar, estaVazio, tentativa])

  const recarregar = useCallback(() => {
    setEstado({ status: 'carregando' })
    setTentativa((valor) => valor + 1)
  }, [])

  return { estado, recarregar }
}
