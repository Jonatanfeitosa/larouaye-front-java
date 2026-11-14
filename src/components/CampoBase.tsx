import type { ReactNode } from 'react'

interface AtributosControle {
  id: string
  className: string
  'aria-invalid': boolean
  'aria-describedby': string | undefined
}

interface CampoBaseProps {
  id: string
  rotulo: string
  ajuda?: string
  erro?: string
  // Render prop: o campo recebe os atributos de acessibilidade já prontos
  children: (atributos: AtributosControle) => ReactNode
}

// Estrutura comum a todo campo: rótulo, ajuda, controle e mensagem de erro.
export function CampoBase({ id, rotulo, ajuda, erro, children }: CampoBaseProps) {
  // aria-describedby liga o campo à ajuda e ao erro: o leitor de tela lê junto
  const descricao =
    [ajuda ? `${id}-ajuda` : null, erro ? `${id}-erro` : null].filter(Boolean).join(' ') || undefined

  const className = `min-h-12 w-full rounded-xl border-2 bg-white px-4 py-2 text-lg text-azul ${
    erro ? 'border-erro' : 'border-azul'
  }`

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-semibold">
        {rotulo}
      </label>
      {ajuda && (
        <p id={`${id}-ajuda`} className="text-base text-azul/80">
          {ajuda}
        </p>
      )}
      {children({ id, className, 'aria-invalid': Boolean(erro), 'aria-describedby': descricao })}
      {erro && (
        <p id={`${id}-erro`} className="font-semibold text-erro">
          {erro}
        </p>
      )}
    </div>
  )
}
