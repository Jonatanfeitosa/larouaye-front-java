import { Link } from 'react-router'

// Menu provisório do núcleo. O dono (Marcelo) SUBSTITUI este arquivo pelo menu responsivo e acessível.
export function Navbar() {
  return (
    <nav aria-label="Principal" className="bg-white px-4 py-3">
      <ul className="mx-auto flex max-w-5xl flex-wrap gap-4">
        <li><Link to="/">Início</Link></li>
        <li><Link to="/assistente">Assistente</Link></li>
        <li><Link to="/jornada">Minha jornada</Link></li>
        <li><Link to="/faq">Dúvidas</Link></li>
        <li><Link to="/sobre">Sobre</Link></li>
        <li><Link to="/integrantes">Integrantes</Link></li>
        <li><Link to="/contato">Contato</Link></li>
      </ul>
    </nav>
  )
}
