import { Button } from './Button'

interface ErroMensagemProps {
  mensagem: string
  titulo?: string
  onTentarNovamente?: () => void
}

// Estado "erro" padrão: role=alert faz o leitor de tela anunciar na hora.
// Fundo branco + texto vermelho-escuro = contraste alto (passa no WCAG AA).
export function ErroMensagem({ mensagem, titulo = 'Algo deu errado', onTentarNovamente }: ErroMensagemProps) {
  return (
    <div role="alert" className="rounded-2xl border-2 border-erro bg-white p-5">
      <h2 className="text-xl font-bold text-erro">{titulo}</h2>
      <p className="mt-2">{mensagem}</p>
      {onTentarNovamente && (
        <Button className="mt-4" variante="secundario" onClick={onTentarNovamente}>
          Tentar de novo
        </Button>
      )}
    </div>
  )
}
