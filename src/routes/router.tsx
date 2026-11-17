import { createBrowserRouter } from 'react-router'
import { ErroInesperado } from '../components/ErroInesperado'
import { Home } from '../pages/Home'
import { RootLayout } from './RootLayout'

// Só a Home (primeira tela) vai no pacote inicial. As outras páginas são baixadas quando a pessoa entra nelas,
// o que deixa a abertura do site bem mais leve em celular e conexão lenta.
const pagina = (carregar: () => Promise<Record<string, unknown>>, nome: string) => async () => ({
  Component: (await carregar())[nome] as React.ComponentType,
})

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErroInesperado />,
    children: [
      { index: true, element: <Home /> },
      { path: 'assistente', lazy: pagina(() => import('../pages/Assistente'), 'Assistente') },
      { path: 'jornada', lazy: pagina(() => import('../pages/Jornada'), 'Jornada') },
      { path: 'faq', lazy: pagina(() => import('../pages/Faq'), 'Faq') },
      { path: 'sobre', lazy: pagina(() => import('../pages/Sobre'), 'Sobre') },
      { path: 'integrantes', lazy: pagina(() => import('../pages/Integrantes'), 'Integrantes') },
      { path: 'integrantes/:id', lazy: pagina(() => import('../pages/IntegranteDetalhe'), 'IntegranteDetalhe') },
      { path: 'contato', lazy: pagina(() => import('../pages/Contato'), 'Contato') },
      { path: '*', lazy: pagina(() => import('../pages/NaoEncontrada'), 'NaoEncontrada') },
    ],
  },
])
