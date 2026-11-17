import { isRouteErrorResponse, useRouteError } from 'react-router'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { LinkBotao } from './LinkBotao'

// Rede de segurança (equivale ao ErrorBoundary do SoulUp): se uma tela quebrar,
// a pessoa vê uma explicação em português simples, com saída, em vez de página em branco.
export function ErroInesperado() {
  const erro = useRouteError()
  useTituloPagina('Algo deu errado')
  const detalhe = isRouteErrorResponse(erro) ? `Erro ${erro.status}` : erro instanceof Error ? erro.message : ''
  return (
    <main className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold">Algo deu errado</h1>
      <p role="alert" className="mt-4 text-lg">
        Encontramos um problema inesperado. Seus dados não foram perdidos. Volte ao início e tente de novo.
      </p>
      {detalhe && <p className="mt-3 break-words text-sm ">{detalhe}</p>}
      <LinkBotao to="/" className="mt-6">
        Voltar ao início
      </LinkBotao>
    </main>
  )
}
