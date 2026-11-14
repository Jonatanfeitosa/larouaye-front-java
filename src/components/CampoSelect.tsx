import type { ComponentProps } from 'react'
import { CampoBase } from './CampoBase'

interface Opcao {
  valor: string
  rotulo: string
}

interface CampoSelectProps extends Omit<ComponentProps<'select'>, 'id' | 'children'> {
  id: string
  rotulo: string
  opcoes: readonly Opcao[]
  ajuda?: string
  erro?: string
  textoVazio?: string
}

// <select> nativo: leitores de tela e teclado já funcionam sem nenhum ARIA extra.
export function CampoSelect({
  id,
  rotulo,
  opcoes,
  ajuda,
  erro,
  textoVazio = 'Escolha uma opção',
  ...resto
}: CampoSelectProps) {
  return (
    <CampoBase id={id} rotulo={rotulo} ajuda={ajuda} erro={erro}>
      {(atributos) => (
        <select {...atributos} {...resto}>
          <option value="">{textoVazio}</option>
          {opcoes.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ))}
        </select>
      )}
    </CampoBase>
  )
}
