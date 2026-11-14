import type { ComponentProps } from 'react'
import { CampoBase } from './CampoBase'

interface CampoTextoProps extends Omit<ComponentProps<'input'>, 'id'> {
  id: string
  rotulo: string
  ajuda?: string
  erro?: string
}

// Funciona direto com o register() do React Hook Form: {...register('campo')}
export function CampoTexto({ id, rotulo, ajuda, erro, ...resto }: CampoTextoProps) {
  return (
    <CampoBase id={id} rotulo={rotulo} ajuda={ajuda} erro={erro}>
      {(atributos) => <input {...atributos} {...resto} />}
    </CampoBase>
  )
}
