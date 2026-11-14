import { useTituloPagina } from '../hooks/useTituloPagina'

// Página provisória do núcleo. Quem é dono desta página SUBSTITUI este arquivo pela versão real.
export function Contato() {
  useTituloPagina('Contato')
  return (
    <section aria-labelledby="titulo-pagina">
      <h1 id="titulo-pagina" className="text-3xl font-bold">Contato</h1>
      <p className="mt-2">Em construção.</p>
    </section>
  )
}
