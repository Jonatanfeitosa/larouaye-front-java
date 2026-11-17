import { useParams } from 'react-router'
import { Card } from '../components/Card'
import { EstadoVazio } from '../components/EstadoVazio'
import { LinkBotao } from '../components/LinkBotao'
import { INTEGRANTES } from '../data/integrantes'
import { useTituloPagina } from '../hooks/useTituloPagina'

// Rota dinâmica obrigatória: /integrantes/:id
export function IntegranteDetalhe() {
  const { id } = useParams()
  const integrante = INTEGRANTES.find((i) => i.id === id)
  useTituloPagina(integrante?.nome ?? 'Integrante não encontrado')

  if (!integrante) {
    return (
      <EstadoVazio nivel={1} titulo="Integrante não encontrado" texto="Esse endereço não corresponde a ninguém da equipe.">
        <LinkBotao to="/integrantes">Ver todos os integrantes</LinkBotao>
      </EstadoVazio>
    )
  }

  return (
    <article aria-labelledby="titulo-integrante">
      <h1 id="titulo-integrante" className="text-3xl font-bold">
        {integrante.nome}
      </h1>
      <Card className="mt-4">
        <p className="text-xl font-semibold">{integrante.papel}</p>
        <p className="mt-1">{integrante.rm}</p>
        <p className="mt-4">{integrante.descricao}</p>
        <h2 className="mt-4 text-xl font-bold">Tecnologias</h2>
        <ul className="mt-2 flex flex-wrap gap-2">
          {integrante.tecnologias.map((t) => (
            <li key={t} className="rounded-full border-2 border-azul px-3 py-1 text-base font-semibold">
              {t}
            </li>
          ))}
        </ul>
      </Card>
      <LinkBotao to="/integrantes" variante="secundario" className="mt-6">
        Voltar aos integrantes
      </LinkBotao>
    </article>
  )
}
