import { Aviso } from '../components/Aviso'
import { Card } from '../components/Card'
import { useTituloPagina } from '../hooks/useTituloPagina'

export function Sobre() {
  useTituloPagina('Sobre')
  return (
    <div className="space-y-6">
      <section aria-labelledby="titulo-sobre">
        <h1 id="titulo-sobre" className="text-3xl font-bold">
          Sobre o LarOuAyê
        </h1>
        <p className="mt-3">
          Comprar o primeiro imóvel assusta, principalmente para quem tem pouca informação. Os papéis são muitos, as
          palavras são difíceis e um erro pode custar caro. O LarOuAyê nasceu para explicar esse caminho de forma simples,
          gratuita e acessível.
        </p>
      </section>

      <section aria-labelledby="titulo-como-pensa" className="grid gap-4 md:grid-cols-3">
        <h2 id="titulo-como-pensa" className="sr-only">
          Como o LarOuAyê funciona
        </h2>
        <Card>
          <h3 className="text-xl font-bold">A IA identifica</h3>
          <p className="mt-1">Modelos de Machine Learning entendem sobre o que é a sua dúvida.</p>
        </Card>
        <Card>
          <h3 className="text-xl font-bold">O sistema decide</h3>
          <p className="mt-1">A API Java escolhe a orientação certa, sem inventar respostas.</p>
        </Card>
        <Card>
          <h3 className="text-xl font-bold">O conteúdo fundamenta</h3>
          <p className="mt-1">Cada resposta vem de um conteúdo jurídico revisado, com a base legal indicada.</p>
        </Card>
      </section>

      <section aria-labelledby="titulo-inclusao">
        <h2 id="titulo-inclusao" className="text-2xl font-bold">
          Inclusão de ponta a ponta
        </h2>
        <ul className="mt-3 list-disc space-y-1 pl-6">
          <li>Linguagem simples e frases curtas.</li>
          <li>Leitura em voz alta das páginas e das respostas, e ditado da pergunta pelo microfone (Chrome e Edge).</li>
          <li>Letra que pode ser aumentada, modo de leitura fácil, alto contraste e uso completo pelo teclado.</li>
          <li>Feito para funcionar com leitores de tela.</li>
          <li>Nenhum dado sensível, como CPF, é pedido.</li>
        </ul>
        <p className="mt-3">
          Alinhado aos Objetivos de Desenvolvimento Sustentável 10 (redução das desigualdades) e 11 (cidades e
          comunidades sustentáveis).
        </p>
      </section>

      <Aviso />
    </div>
  )
}
