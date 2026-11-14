import type { ComponentProps } from 'react'

// Caixa branca reutilizável. Fundo branco garante o contraste do texto de erro.
export function Card({ className = '', ...resto }: ComponentProps<'div'>) {
  return (
    <div
      className={`rounded-2xl border border-azul/20 bg-white p-5 shadow-sm sm:p-6 ${className}`}
      {...resto}
    />
  )
}
