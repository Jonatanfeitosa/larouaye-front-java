import { Aviso } from '../components/Aviso'
import { Card } from '../components/Card'
import { Casinha } from '../components/Casinha'
import { LinkBotao } from '../components/LinkBotao'
import { useTituloPagina } from '../hooks/useTituloPagina'

const PASSOS = [
  { n: '1', titulo: 'Conte sua situação', texto: 'Escolha seu estado e em que etapa da compra você está.' },
  { n: '2', titulo: 'Pergunte do seu jeito', texto: 'Escreva ou use as perguntas prontas. Sem termos difíceis.' },
  { n: '3', titulo: 'Entenda e siga em frente', texto: 'Receba a orientação, os cuidados e a próxima etapa.' },
]

export function Home() {
  useTituloPagina('Início')
  return (
    <div className="space-y-10">
      <section aria-labelledby="titulo-home" className="rounded-3xl bg-azul p-6 text-white sm:p-10">
        <Casinha className="mb-4 h-28 w-28" />
        <h1 id="titulo-home" className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          Seu primeiro imóvel, sem juridiquês
        </h1>
        <p className="mt-4 max-w-2xl text-xl">
          O LarOuAyê explica, em linguagem simples, os passos, os documentos e os cuidados para comprar o seu primeiro
          imóvel com segurança. É gratuito.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <LinkBotao to="/assistente" variante="destaque">
            Fazer uma pergunta
          </LinkBotao>
          <LinkBotao to="/jornada" variante="secundario">
            Ver minha jornada
          </LinkBotao>
        </div>
        <p className="mt-6 text-lg">
          <strong className="text-ouro">Prefere ouvir?</strong> Use o botão “Ouvir esta página” no topo. Você também pode
          aumentar a letra.
        </p>
      </section>

      <section aria-labelledby="titulo-como">
        <h2 id="titulo-como" className="text-2xl font-bold">
          Como funciona
        </h2>
        <ol className="mt-4 grid gap-4 md:grid-cols-3">
          {PASSOS.map((p) => (
            <li key={p.n}>
              <Card className="h-full">
                <p className="text-3xl font-bold" aria-hidden="true">
                  {p.n}
                </p>
                <h3 className="mt-2 text-xl font-bold">{p.titulo}</h3>
                <p className="mt-1">{p.texto}</p>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <Aviso />
    </div>
  )
}
