import { z } from 'zod'

export const contatoSchema = z.object({
  nome: z.string().trim().min(2, 'Escreva seu nome.').max(80, 'O nome está grande demais.'),
  email: z.email('Digite um e-mail válido, como nome@exemplo.com.'),
  assunto: z.string().trim().min(3, 'Escreva o assunto.').max(100, 'O assunto pode ter até 100 caracteres.'),
  mensagem: z
    .string()
    .trim()
    .min(10, 'Escreva pelo menos 10 caracteres na mensagem.')
    .max(500, 'A mensagem pode ter até 500 caracteres.'),
})

export type ContatoDados = z.infer<typeof contatoSchema>
