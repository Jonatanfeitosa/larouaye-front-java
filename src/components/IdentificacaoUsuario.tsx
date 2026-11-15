import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUsuario } from '../contexts/UsuarioContext'
import { usuarioSchema, type UsuarioDados } from '../schemas/usuarioSchema.ts'
import { cadastrarUsuario } from '../services/usuarioService.ts'
import { Button } from './Button'
import { Card } from './Card'
import { CampoTexto } from './CampoTexto'
import { ResumoErros } from './ResumoErros'

// Cadastro mínimo (só nome). É uma ESCRITA REAL na API Java: POST /usuarios.
export function IdentificacaoUsuario() {
  const { entrar } = useUsuario()
  const [erroApi, setErroApi] = useState<string | null>(null)
  const [tentativas, setTentativas] = useState(0)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UsuarioDados>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: { nome: '', email: '' },
    shouldFocusError: false,
  })

  const itens = Object.entries(errors).map(([campo, e]) => ({ campo, mensagem: e?.message ?? '' }))

  async function enviar(dados: UsuarioDados) {
    setErroApi(null)
    try {
      entrar(await cadastrarUsuario(dados))
    } catch (erro) {
      setErroApi(erro instanceof Error ? erro.message : 'Não foi possível salvar. Tente de novo.')
    }
  }

  return (
    <Card>
      <h2 className="text-2xl font-bold">Antes de começar</h2>
      <p className="mt-2">Para guardar o seu histórico e a sua jornada, diga como podemos chamar você. Não pedimos CPF.</p>
      <form
        noValidate
        className="mt-4 space-y-4"
        onSubmit={handleSubmit(enviar, () => setTentativas((n) => n + 1))}
      >
        {itens.length > 0 && <ResumoErros key={tentativas} itens={itens} />}
        {erroApi && (
          <p role="alert" className="rounded-xl border-2 border-erro bg-white p-3 font-semibold text-erro">
            {erroApi}
          </p>
        )}
        <CampoTexto id="nome" rotulo="Seu nome" autoComplete="given-name" erro={errors.nome?.message} {...register('nome')} />
        <CampoTexto
          id="email"
          rotulo="E-mail (opcional)"
          type="email"
          autoComplete="email"
          erro={errors.email?.message}
          {...register('email')}
        />
        <Button type="submit" carregando={isSubmitting}>
          {isSubmitting ? 'Salvando…' : 'Começar'}
        </Button>
      </form>
    </Card>
  )
}
