import { Link, type LinkProps } from 'react-router'
import { classesBotao, type Variante } from './estilosBotao.ts'

interface LinkBotaoProps extends LinkProps {
  variante?: Variante
}

// Link (<a>) com aparência de botão. Use para NAVEGAR; use <Button> para AGIR.
export function LinkBotao({ variante = 'primario', className = '', ...resto }: LinkBotaoProps) {
  return <Link className={classesBotao(variante, className)} {...resto} />
}
