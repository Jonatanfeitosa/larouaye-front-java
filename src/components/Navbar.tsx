import { useState } from 'react'
import { Link, NavLink } from 'react-router'

const LINKS = [
  { to: '/', rotulo: 'Início' },
  { to: '/assistente', rotulo: 'Assistente' },
  { to: '/jornada', rotulo: 'Minha jornada' },
  { to: '/faq', rotulo: 'Dúvidas' },
  { to: '/sobre', rotulo: 'Sobre' },
  { to: '/integrantes', rotulo: 'Integrantes' },
  { to: '/contato', rotulo: 'Contato' },
]

export function Navbar() {
  const [aberto, setAberto] = useState(false)

  return (
    <header className="bg-azul text-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link to="/" className="inline-flex min-h-11 items-center text-2xl font-bold text-ouro focus-visible:outline-ouro">
          LarOuAyê
        </Link>

        <button
          type="button"
          className="min-h-11 rounded-lg border-2 border-white px-4 font-semibold focus-visible:outline-ouro lg:hidden"
          aria-expanded={aberto}
          aria-controls="menu-principal"
          onClick={() => setAberto((valor) => !valor)}
        >
          {aberto ? 'Fechar menu' : 'Abrir menu'}
        </button>

        <nav
          id="menu-principal"
          aria-label="Principal"
          className={`${aberto ? 'block' : 'hidden'} w-full lg:block lg:w-auto`}
        >
          <ul className="flex flex-col gap-1 lg:flex-row">
            {LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setAberto(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2 font-semibold focus-visible:outline-ouro ${
                      isActive ? 'bg-ouro text-azul' : 'hover:bg-white/15'
                    }`
                  }
                >
                  {link.rotulo}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
