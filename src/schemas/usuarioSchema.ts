import { z } from 'zod'

// Dados mínimos: só um nome para identificar a pessoa. E-mail é opcional.
export const usuarioSchema = z.object({
  nome: z.string().trim().min(2, 'Escreva seu nome (pode ser só o primeiro).').max(80, 'O nome está grande demais.'),
  email: z.union([z.literal(''), z.email('Digite um e-mail válido, como nome@exemplo.com.')]),
})

export type UsuarioDados = z.infer<typeof usuarioSchema>
