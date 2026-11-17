// Fonte única dos estilos de botão: usada pelo <Button> e pelo <LinkBotao>,
// assim um botão e um link-com-cara-de-botão ficam idênticos.
export type Variante = 'primario' | 'secundario' | 'destaque'

const BASE =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 py-3 text-lg font-semibold transition-colors motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-60'

// REGRA DO HOVER: sempre uma cor SÓLIDA e o texto com cor explícita no hover.
// Cor translúcida (ex.: bg-azul/10) mistura com o que está atrás do botão: dentro de um painel azul,
// o fundo virava azul e o texto azul sumia (contraste 1:1). Filtros (brightness) também mexem no texto.
// not-disabled: botão desabilitado não reage ao mouse.
// Contrastes (WCAG AA): branco sobre azul ≈ 14:1, azul sobre dourado ≈ 8:1, azul sobre ouro-claro ≈ 11:1
const VARIANTES: Record<Variante, string> = {
  primario: 'bg-azul text-white not-disabled:hover:bg-grafite not-disabled:hover:text-white',
  secundario: 'border-2 border-azul bg-white text-azul not-disabled:hover:bg-ouro-claro not-disabled:hover:text-azul',
  destaque: 'bg-ouro text-azul not-disabled:hover:bg-ouro-claro not-disabled:hover:text-azul',
}

export function classesBotao(variante: Variante, extra = ''): string {
  return `${BASE} ${VARIANTES[variante]} ${extra}`.trim()
}
