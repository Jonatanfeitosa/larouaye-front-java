// Fonte única dos estilos de botão: usada pelo <Button> e pelo <LinkBotao>,
// assim um botão e um link-com-cara-de-botão ficam idênticos.
export type Variante = 'primario' | 'secundario' | 'destaque'

const BASE =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 py-3 text-lg font-semibold disabled:cursor-not-allowed disabled:opacity-60'

// Contrastes (WCAG AA): branco sobre azul ≈ 14:1 e azul sobre dourado ≈ 8:1
const VARIANTES: Record<Variante, string> = {
  primario: 'bg-azul text-white hover:brightness-110',
  secundario: 'border-2 border-azul bg-white text-azul hover:bg-azul/10',
  destaque: 'bg-ouro text-azul hover:brightness-95',
}

export function classesBotao(variante: Variante, extra = ''): string {
  return `${BASE} ${VARIANTES[variante]} ${extra}`.trim()
}
