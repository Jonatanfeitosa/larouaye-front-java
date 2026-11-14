import { z } from 'zod'
import { ETAPAS_COMPRA, UFS } from '../data/opcoes'

const codigosEtapa = ETAPAS_COMPRA.map((e) => e.valor) as [string, ...string[]]

export const consultaSchema = z.object({
  pergunta: z
    .string()
    .trim()
    .min(5, 'Digite pelo menos 5 caracteres.')
    .max(1000, 'A pergunta deve ter até 1000 caracteres.'),
  uf: z.enum(UFS, { error: 'Escolha o seu estado (UF).' }),
  etapa: z.enum(codigosEtapa, { error: 'Escolha em que etapa da compra você está.' }),
})

export type ConsultaDados = z.infer<typeof consultaSchema>
