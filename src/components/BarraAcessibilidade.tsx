
import { useAcessibilidade } from '../contexts/AcessibilidadeContext'
import { useLeituraEmVoz } from '../hooks/useLeituraEmVoz'

// Barra no topo de todas as páginas: tamanho da letra e leitura em voz alta da página.
export function BarraAcessibilidade() {
  const { fonte, aumentarFonte, diminuirFonte, leituraFacil, altoContraste, alternarLeituraFacil, alternarAltoContraste } =
    useAcessibilidade()
  const { suportado, falando, falar, parar } = useLeituraEmVoz()

  function lerPagina() {
    const texto = document.getElementById('conteudo')?.innerText ?? ''
    falar(texto)
  }

  const botao =
    'min-h-11 rounded-lg border-2 border-white px-3 text-sm font-semibold hover:bg-white/15 disabled:opacity-50'

  return (
    <div className="bg-grafite text-white">
      <div
        role="group"
        aria-label="Recursos de acessibilidade"
        className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-4 py-2"
      >
        {suportado && (
          <button
            type="button"
            className={botao}
            aria-pressed={falando}
            onClick={falando ? parar : lerPagina}
          >
            {falando ? '⏹ Parar a leitura' : '🔊 Ouvir esta página'}
          </button>
        )}
        <button type="button" className={botao} onClick={diminuirFonte} disabled={fonte === 'normal'}>
          A−<span className="sr-only"> Diminuir letra</span>
        </button>
        <button type="button" className={botao} onClick={aumentarFonte} disabled={fonte === 'maior'}>
          A+<span className="sr-only"> Aumentar letra</span>
        </button>
        <button type="button" className={botao} aria-pressed={leituraFacil} onClick={alternarLeituraFacil}>
          📖 Leitura fácil
        </button>
        <button type="button" className={botao} aria-pressed={altoContraste} onClick={alternarAltoContraste}>
          ◐ Alto contraste
        </button>
        <span className="text-sm" aria-live="polite">
          Letra: {fonte}
        </span>
      </div>
    </div>
  )
}
