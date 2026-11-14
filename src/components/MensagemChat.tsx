import { Button } from './Button'
import { textoParaVoz, type Mensagem, type Voz } from './mensagemTipos'

export function MensagemChat({ mensagem, voz }: { mensagem: Mensagem; voz: Voz }) {
  if (mensagem.autor === 'usuario') {
    return (
      <li className="ml-auto max-w-[90%] rounded-2xl bg-azul p-4 text-white sm:max-w-[80%]">
        <p className="sr-only">Você perguntou:</p>
        <p>{mensagem.texto}</p>
      </li>
    )
  }

  const m = mensagem
  const textoVoz = textoParaVoz(m)

  return (
    <li className="mr-auto max-w-[95%] rounded-2xl border-2 border-azul bg-white p-4 sm:max-w-[85%]">
      <p className="sr-only">LarOuAyê respondeu:</p>
      {m.titulo && <h3 className="text-xl font-bold">{m.titulo}</h3>}
      <p className="mt-1 whitespace-pre-line">{m.texto}</p>

      {m.cuidados && m.cuidados.length > 0 && (
        <div className="mt-3">
          <h4 className="font-bold">Cuidados</h4>
          <ul className="list-disc pl-6">
            {m.cuidados.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      {m.opcoes && m.opcoes.length > 0 && (
        <ul className="mt-3 list-disc pl-6">
          {m.opcoes.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      )}

      {m.baseLegal && m.baseLegal.length > 0 && (
        <div className="mt-3 rounded-xl bg-cinza p-3 text-base">
          <h4 className="font-bold">Base legal e fontes</h4>
          <ul className="list-disc pl-6">
            {m.baseLegal.map((b) => (
              <li key={`${b.norma}-${b.referencia ?? ''}`}>
                {b.url ? (
                  <a className="font-semibold text-azul underline" href={b.url} target="_blank" rel="noreferrer">
                    {b.norma}
                    {b.referencia ? `, ${b.referencia}` : ''}
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                ) : (
                  <>
                    {b.norma}
                    {b.referencia ? `, ${b.referencia}` : ''}
                  </>
                )}
              </li>
            ))}
          </ul>
          {m.dataRevisao && <p className="mt-1">Conteúdo revisado em {m.dataRevisao}.</p>}
        </div>
      )}

      {m.proximaEtapa && (
        <p className="mt-3 font-semibold">Próxima etapa: {m.proximaEtapa}</p>
      )}

      {voz.suportado && (
        <Button
          className="mt-3"
          variante="secundario"
          aria-pressed={voz.falando}
          onClick={() => (voz.falando ? voz.parar() : voz.falar(textoVoz))}
        >
          {voz.falando ? '⏹ Parar' : '🔊 Ouvir resposta'}
        </Button>
      )}
    </li>
  )
}
