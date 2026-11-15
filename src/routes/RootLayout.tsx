import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'
import { BarraAcessibilidade } from '../components/BarraAcessibilidade'
import { Navbar } from '../components/Navbar'
import { StatusServidor } from '../components/StatusServidor'

export function RootLayout() {
  const { pathname } = useLocation()
  const principalRef = useRef<HTMLElement>(null)
  const caminhoAnterior = useRef(pathname)

  // Numa SPA o navegador não move o foco ao trocar de página: fazemos isso para quem usa leitor de tela.
  useEffect(() => {
    if (caminhoAnterior.current === pathname) return
    caminhoAnterior.current = pathname
    window.scrollTo(0, 0)
    principalRef.current?.focus()
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-semibold"
      >
        Pular para o conteúdo
      </a>

      <BarraAcessibilidade />
      <Navbar />
      <StatusServidor />

      <main
        id="conteudo"
        ref={principalRef}
        tabIndex={-1}
        className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 outline-none"
      >
        <Outlet />
      </main>

      <footer className="bg-azul px-4 py-6 text-center text-white">
        <p className="font-semibold text-ouro">LarOuAyê · Seu primeiro imóvel, sem juridiquês</p>
        <p className="mt-1 text-sm">
          Projeto Global Solution FIAP 2026/2 · CitizenTech. Informação geral; não substitui advogado.
        </p>
      </footer>
    </div>
  )
}
