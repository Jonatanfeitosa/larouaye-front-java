import { useEffect } from 'react'

// Numa SPA a aba do navegador não muda sozinha. Leitor de tela anuncia o título
// ao trocar de página, então cada página precisa ter o seu.
export function useTituloPagina(titulo: string) {
  useEffect(() => {
    document.title = `${titulo} · LarOuAyê`
  }, [titulo])
}
