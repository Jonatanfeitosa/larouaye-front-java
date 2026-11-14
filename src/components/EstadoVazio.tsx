import type { ReactNode } from 'react'

interface EstadoVazioProps {
  titulo: string
  texto: string
  children?: ReactNode
}

// Estado "vazio" padrão: a busca deu certo, mas não há nada para mostrar.
// Sempre explique o que fazer em seguida (children costuma ser um botão/link).
export function EstadoVazio({ titulo, texto, children }: EstadoVazioProps) {
  return (
    <div role="status" className="rounded-2xl border-2 border-dashed border-azul bg-white p-6 text-center">
      <h2 className="text-xl font-bold">{titulo}</h2>
      <p className="mt-2">{texto}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}
