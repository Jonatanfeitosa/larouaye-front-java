import { EstadoVazio } from '../components/EstadoVazio'
import { LinkBotao } from '../components/LinkBotao'
import { useTituloPagina } from '../hooks/useTituloPagina'

export function NaoEncontrada() {
  useTituloPagina('Página não encontrada')
  return (
    <EstadoVazio titulo="Página não encontrada" texto="O endereço que você abriu não existe no LarOuAyê.">
      <LinkBotao to="/">Voltar ao início</LinkBotao>
    </EstadoVazio>
  )
}
