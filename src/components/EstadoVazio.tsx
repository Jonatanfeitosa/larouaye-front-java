import type { ReactNode } from 'react'

interface EstadoVazioProps {
  titulo: string
  texto: string
  // Quando o estado vazio é a página inteira (ex.: 404), o título precisa ser <h1>; dentro de outra tela, <h2>.
  nivel?: 1 | 2
  children?: ReactNode
}

// Estado "vazio" padrão: a busca deu certo, mas não há nada para mostrar.
// Sempre explique o que fazer em seguida (children costuma ser um botão/link).
export function EstadoVazio({ titulo, texto, nivel = 2, children }: EstadoVazioProps) {
  const Titulo = nivel === 1 ? 'h1' : 'h2'
  return (
    <div role="status" className="rounded-2xl border-2 border-dashed border-azul bg-white p-6 text-center">
      <Titulo className="text-xl font-bold">{titulo}</Titulo>
      <p className="mt-2">{texto}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  )
}
