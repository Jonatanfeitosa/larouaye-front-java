import type { ReactNode } from 'react'

// Bloco cinza pulsando que "ocupa o lugar" do conteúdo enquanto ele carrega.
// aria-hidden: o leitor de tela ignora os blocos; quem avisa é o <SkeletonCarregando>.
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-azul/15 motion-reduce:animate-none ${className}`}
    />
  )
}

export function SkeletonCard() {
  return (
    <div aria-hidden="true" className="rounded-2xl border border-azul/20 bg-white p-5">
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="mt-4 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-5/6" />
    </div>
  )
}

interface SkeletonCarregandoProps {
  rotulo?: string
  children: ReactNode
}

// Envolve os skeletons e anuncia "Carregando…" para leitores de tela (role=status).
export function SkeletonCarregando({ rotulo = 'Carregando conteúdo', children }: SkeletonCarregandoProps) {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{rotulo}</span>
      <div className="space-y-4">{children}</div>
    </div>
  )
}
