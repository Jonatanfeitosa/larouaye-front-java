import type { ComponentProps } from 'react'
import { CampoBase } from './CampoBase.tsx'

interface CampoAreaTextoProps extends Omit<ComponentProps<'textarea'>, 'id'> {
  id: string
  rotulo: string
  ajuda?: string
  erro?: string
}

export function CampoAreaTexto({ id, rotulo, ajuda, erro, rows = 5, ...resto }: CampoAreaTextoProps) {
  return (
    <CampoBase id={id} rotulo={rotulo} ajuda={ajuda} erro={erro}>
      {(atributos) => <textarea rows={rows} {...atributos} {...resto} />}
    </CampoBase>
  )
}
