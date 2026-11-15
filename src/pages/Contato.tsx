import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../components/Button'
import { CampoAreaTexto } from '../components/CampoAreaTexto'
import { CampoTexto } from '../components/CampoTexto'
import { Card } from '../components/Card'
import { ResumoErros } from '../components/ResumoErros'
import { contatoSchema, type ContatoDados } from '../schemas/contatoSchema'
import { useTituloPagina } from '../hooks/useTituloPagina'

const EMAIL = (import.meta.env.VITE_EMAIL_CONTATO as string | undefined) ?? ''

// Honesto: não finge envio. Se houver e-mail configurado, abre o app de e-mail da pessoa com a mensagem pronta.
export function Contato() {
  useTituloPagina('Contato')
  const [tentativas, setTentativas] = useState(0)
  const [pronto, setPronto] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContatoDados>({
    resolver: zodResolver(contatoSchema),
    defaultValues: { nome: '', email: '', assunto: '', mensagem: '' },
    shouldFocusError: false,
  })
  const itens = Object.entries(errors).map(([campo, e]) => ({ campo, mensagem: e?.message ?? '' }))

  function enviar(d: ContatoDados) {
    if (EMAIL) {
      const corpo = encodeURIComponent(`${d.mensagem}\n\n${d.nome} <${d.email}>`)
      window.location.assign(`mailto:${EMAIL}?subject=${encodeURIComponent(d.assunto)}&body=${corpo}`)
    }
    setPronto(true)
    reset()
  }

  return (
    <section aria-labelledby="titulo-contato" className="mx-auto max-w-2xl">
      <h1 id="titulo-contato" className="text-3xl font-bold">
        Fale com a equipe
      </h1>
      <p className="mt-2">Tem sugestão, elogio ou encontrou um problema? Escreva para nós.</p>

      {pronto && (
        <p role="status" className="mt-4 rounded-xl border-2 border-ok bg-white p-4 font-semibold text-ok">
          {EMAIL
            ? 'Abrimos o seu aplicativo de e-mail com a mensagem pronta. É só enviar por lá.'
            : 'Mensagem validada. Nesta versão de demonstração ela não é enviada a ninguém.'}
        </p>
      )}

      <Card className="mt-4">
        <form noValidate className="space-y-4" onSubmit={handleSubmit(enviar, () => { setPronto(false); setTentativas((n) => n + 1) })}>
          {itens.length > 0 && <ResumoErros key={tentativas} itens={itens} />}
          <CampoTexto id="nome" rotulo="Nome" autoComplete="name" erro={errors.nome?.message} {...register('nome')} />
          <CampoTexto id="email" rotulo="E-mail" type="email" autoComplete="email" erro={errors.email?.message} {...register('email')} />
          <CampoTexto id="assunto" rotulo="Assunto" erro={errors.assunto?.message} {...register('assunto')} />
          <CampoAreaTexto id="mensagem" rotulo="Mensagem" rows={5} erro={errors.mensagem?.message} {...register('mensagem')} />
          <Button type="submit" carregando={isSubmitting}>
            Enviar mensagem
          </Button>
        </form>
      </Card>
    </section>
  )
}
