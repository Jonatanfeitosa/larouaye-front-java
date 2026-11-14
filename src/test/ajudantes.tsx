import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { AcessibilidadeProvider } from '../contexts/AcessibilidadeContext'
import { UsuarioProvider } from '../contexts/UsuarioContext'

// Mostra uma tela dentro de uma rota de mentira, com os mesmos providers do site.
export function renderNaRota(elemento: ReactElement, caminho = '/', padrao = '/') {
  return render(
    <AcessibilidadeProvider>
      <UsuarioProvider>
        <MemoryRouter initialEntries={[caminho]}>
          <Routes>
            <Route path={padrao} element={elemento} />
          </Routes>
        </MemoryRouter>
      </UsuarioProvider>
    </AcessibilidadeProvider>,
  )
}

// Troca o fetch por uma resposta pronta, sem internet.
export function respostaJson(corpo: unknown, status = 200) {
  return new Response(status === 204 ? null : JSON.stringify(corpo), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
