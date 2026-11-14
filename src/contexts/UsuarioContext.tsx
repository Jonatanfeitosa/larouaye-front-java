import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Usuario } from '../types/usuario'

const CHAVE = 'larouaye:usuario'

interface UsuarioContextoValor {
  usuario: Usuario | null
  entrar: (usuario: Usuario) => void
  sair: () => void
}

const UsuarioContexto = createContext<UsuarioContextoValor | null>(null)

// Guardamos só { id, nome } (dado mínimo, sem CPF). O localStorage pode estar bloqueado: try/catch.
function lerSalvo(): Usuario | null {
  try {
    const bruto = localStorage.getItem(CHAVE)
    if (!bruto) return null
    const dados = JSON.parse(bruto) as Partial<Usuario>
    return typeof dados.id === 'number' && typeof dados.nome === 'string' ? { id: dados.id, nome: dados.nome } : null
  } catch {
    return null
  }
}

export function UsuarioProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(lerSalvo)

  const entrar = useCallback((novo: Usuario) => {
    setUsuario(novo)
    try {
      localStorage.setItem(CHAVE, JSON.stringify(novo))
    } catch {
      // Sem armazenamento: a pessoa continua usando nesta sessão.
    }
  }, [])

  const sair = useCallback(() => {
    setUsuario(null)
    try {
      localStorage.removeItem(CHAVE)
    } catch {
      // ignora
    }
  }, [])

  const valor = useMemo(() => ({ usuario, entrar, sair }), [usuario, entrar, sair])
  return <UsuarioContexto.Provider value={valor}>{children}</UsuarioContexto.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUsuario() {
  const ctx = useContext(UsuarioContexto)
  if (!ctx) throw new Error('useUsuario precisa estar dentro de <UsuarioProvider>')
  return ctx
}
