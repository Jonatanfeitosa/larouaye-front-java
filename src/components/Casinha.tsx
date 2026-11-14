// Provisório do núcleo. (Davi SUBSTITUIR pelo mascote em SVG)
export function Casinha({ className = 'h-28 w-28' }: { falando?: boolean; className?: string }) {
  return (
    <span aria-hidden="true" className={className}>
      🏠
    </span>
  )
}
