// Mascote do LarOuAyê: uma casinha simpática. A boca mexe enquanto ela fala.
// Decorativa (aria-hidden): o conteúdo falado sempre também está escrito na tela.
export function Casinha({ falando = false, className = 'h-28 w-28' }: { falando?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" className={className}>
      {/* chaminé e telhado */}
      <rect x="82" y="16" width="12" height="24" rx="2" fill="#263238" />
      <path d="M8 58 L60 12 L112 58 Z" fill="#102b35" />
      {/* parede */}
      <rect x="18" y="56" width="84" height="54" rx="6" fill="#f2f4f3" stroke="#102b35" strokeWidth="4" />
      {/* olhos */}
      <circle cx="44" cy="80" r="6" fill="#102b35" />
      <circle cx="76" cy="80" r="6" fill="#102b35" />
      <circle cx="46" cy="78" r="2" fill="#fff" />
      <circle cx="78" cy="78" r="2" fill="#fff" />
      {/* bochechas */}
      <circle cx="34" cy="92" r="5" fill="#d8b875" opacity="0.8" />
      <circle cx="86" cy="92" r="5" fill="#d8b875" opacity="0.8" />
      {/* boca */}
      {falando ? (
        <ellipse cx="60" cy="95" rx="9" ry="6" fill="#102b35" className="casinha-boca-fala" />
      ) : (
        <path d="M48 92 Q60 104 72 92" stroke="#102b35" strokeWidth="4" fill="none" strokeLinecap="round" />
      )}
      {/* ouro no telhado */}
      <path d="M26 54 L60 24 L94 54" stroke="#d8b875" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  )
}
