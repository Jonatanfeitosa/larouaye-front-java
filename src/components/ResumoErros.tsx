import { useEffect, useRef } from 'react'

export interface ItemErro {
  campo: string
  mensagem: string
}

interface ResumoErrosProps {
  itens: ItemErro[]
}

// Aparece no topo do formulário quando o envio falha na validação e RECEBE O FOCO.
// Assim o leitor de tela anuncia o problema na hora (role=alert) e a pessoa
// pula direto para o campo com erro pelo botão. Use key={tentativas} no pai para
// remontar o componente (e refocar) a cada novo envio inválido.
export function ResumoErros({ itens }: ResumoErrosProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ref.current?.focus()
  }, [])

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="alert"
      aria-labelledby="titulo-resumo-erros"
      className="rounded-2xl border-2 border-erro bg-white p-5"
    >
      <h2 id="titulo-resumo-erros" className="text-xl font-bold text-erro">
        {itens.length === 1 ? 'Revise 1 campo' : `Revise ${itens.length} campos`}
      </h2>
      <ul className="mt-2 list-disc space-y-1 pl-6">
        {itens.map((item) => (
          <li key={item.campo}>
            <button
              type="button"
              className="text-left underline"
              onClick={() => document.getElementById(item.campo)?.focus()}
            >
              {item.mensagem}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
