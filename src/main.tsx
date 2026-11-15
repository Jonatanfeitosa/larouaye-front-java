import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import { AcessibilidadeProvider } from './contexts/AcessibilidadeContext.tsx'
import { UsuarioProvider } from './contexts/UsuarioContext.tsx'
import './index.css'
import { router } from './routes/router.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AcessibilidadeProvider>
      <UsuarioProvider>
        <RouterProvider router={router} />
      </UsuarioProvider>
    </AcessibilidadeProvider>
  </StrictMode>,
)
