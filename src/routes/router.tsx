import { createBrowserRouter } from 'react-router'
import { Assistente } from '../pages/Assistente'
import { Contato } from '../pages/Contato'
import { Faq } from '../pages/Faq'
import { Home } from '../pages/Home'
import { IntegranteDetalhe } from '../pages/IntegranteDetalhe'
import { Integrantes } from '../pages/Integrantes'
import { Jornada } from '../pages/Jornada'
import { NaoEncontrada } from '../pages/NaoEncontrada'
import { Sobre } from '../pages/Sobre'
import { RootLayout } from './RootLayout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'assistente', element: <Assistente /> },
      { path: 'jornada', element: <Jornada /> },
      { path: 'faq', element: <Faq /> },
      { path: 'sobre', element: <Sobre /> },
      { path: 'integrantes', element: <Integrantes /> },
      { path: 'integrantes/:id', element: <IntegranteDetalhe /> },
      { path: 'contato', element: <Contato /> },
      { path: '*', element: <NaoEncontrada /> },
    ],
  },
])
