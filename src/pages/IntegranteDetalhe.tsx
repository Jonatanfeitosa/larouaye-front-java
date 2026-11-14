import { useParams } from 'react-router'
import { useTituloPagina } from '../hooks/useTituloPagina'

// Página provisória do núcleo. Quem é dono desta página SUBSTITUI este arquivo pela versão real.
export function IntegranteDetalhe() {
  useTituloPagina('Integrante')
  const { id } = useParams()
  return (
    <section aria-labelledby="titulo-pagina">
      <h1 id="titulo-pagina" className="text-3xl font-bold">Integrante</h1>
      <p className="mt-2">Em construção.{id ? ` (${id})` : ''}</p>
    </section>
  )
}
