import type { ComponentProps } from 'react'
import { classesBotao, type Variante } from './estilosBotao.ts'

interface ButtonProps extends ComponentProps<'button'> {
  variante?: Variante
  carregando?: boolean
  textoCarregando?: string
}

export function Button({
  variante = 'primario',
  carregando = false,
  textoCarregando = 'Carregando…',
  disabled,
  className = '',
  type = 'button',
  children,
  ...resto
}: ButtonProps) {
  return (
    <button
      type={type}
      // Desabilita durante o carregamento: evita clique duplo e envio repetido
      disabled={disabled || carregando}
      // Avisa o leitor de tela que o botão está ocupado
      aria-busy={carregando}
      className={classesBotao(variante, className)}
      {...resto}
    >
      {carregando && (
        <span
          aria-hidden="true"
          className="size-5 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
        />
      )}
      {carregando ? textoCarregando : children}
    </button>
  )
}
