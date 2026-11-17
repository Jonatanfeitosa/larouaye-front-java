import { Card } from '../components/Card'
import { LinkBotao } from '../components/LinkBotao'
import { INTEGRANTES } from '../data/integrantes'
import { useTituloPagina } from '../hooks/useTituloPagina'

export function Integrantes() {
  useTituloPagina('Integrantes')
  return (
    <section aria-labelledby="titulo-integrantes">
      <h1 id="titulo-integrantes" className="text-3xl font-bold">
        Quem fez o LarOuAyê
      </h1>
      <p className="mt-2">Cinco estudantes da FIAP, uma solução. Cada pessoa cuida de uma parte.</p>
      <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {INTEGRANTES.map((i) => (
          <li key={i.id}>
            <Card className="flex h-full flex-col">
              <h2 className="text-xl font-bold">{i.nome}</h2>
              <p className="mt-1 font-semibold">{i.papel}</p>
              <p className="mt-1 text-base">{i.rm}</p>
              <LinkBotao to={`/integrantes/${i.id}`} variante="secundario" className="mt-auto self-start">
                Ver detalhes<span className="sr-only"> de {i.nome}</span>
              </LinkBotao>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  )
}
