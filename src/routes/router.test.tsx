import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { AcessibilidadeProvider } from '../contexts/AcessibilidadeContext'
import { UsuarioProvider } from '../contexts/UsuarioContext'
import { respostaJson } from '../test/ajudantes'
import { router } from './router'

afterEach(() => vi.unstubAllGlobals())

function abrir(caminho: string) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(respostaJson([])))
  const memoria = createMemoryRouter(router.routes, { initialEntries: [caminho] })
  return render(
    <AcessibilidadeProvider>
      <UsuarioProvider>
        <RouterProvider router={memoria} />
      </UsuarioProvider>
    </AcessibilidadeProvider>,
  )
}

describe('rotas', () => {
  it.each(['/', '/sobre', '/integrantes', '/integrantes/fernando-oliveira', '/contato', '/faq', '/jornada', '/assistente'])(
    '%s abre uma página com um título principal (h1)',
    async (caminho) => {
      abrir(caminho)
      expect(await screen.findAllByRole('heading', { level: 1 })).toHaveLength(1)
    },
  )

  it('endereço inexistente cai na página 404', async () => {
    abrir('/nao-existe')
    expect(await screen.findByText('Página não encontrada', { selector: 'h1,h2,h3' })).toBeInTheDocument()
  })

  it('tem o link de pular para o conteúdo e a área principal (main)', async () => {
    abrir('/')
    expect(await screen.findByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /pular/i })).toHaveAttribute('href', '#conteudo')
  })

  it('o menu principal está presente em todas as páginas', async () => {
    abrir('/faq')
    expect(await screen.findByRole('navigation', { name: 'Principal' })).toBeInTheDocument()
  })
})
