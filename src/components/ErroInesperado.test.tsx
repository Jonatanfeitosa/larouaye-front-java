import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { ErroInesperado } from './ErroInesperado'

function Quebra(): never {
  throw new Error('falha de teste')
}

describe('ErroInesperado', () => {
  it('mostra mensagem amigável e saída quando uma tela quebra', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const router = createMemoryRouter([{ path: '/', element: <Quebra />, errorElement: <ErroInesperado /> }])
    render(<RouterProvider router={router} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Algo deu errado' })).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('Seus dados não foram perdidos')
    expect(screen.getByRole('link', { name: 'Voltar ao início' })).toHaveAttribute('href', '/')
  })
})
