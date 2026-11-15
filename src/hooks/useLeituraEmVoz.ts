import { useCallback, useEffect, useState } from 'react'

// Leitura em voz alta com a API nativa do navegador (speechSynthesis). Sem biblioteca.
// Nem todo navegador tem voz em português: por isso o recurso é um EXTRA, nunca o único caminho.
export function useLeituraEmVoz() {
  const suportado = typeof window !== 'undefined' && 'speechSynthesis' in window
  const [falando, setFalando] = useState(false)

  const parar = useCallback(() => {
    if (!suportado) return
    window.speechSynthesis.cancel()
    setFalando(false)
  }, [suportado])

  const falar = useCallback(
    (texto: string) => {
      if (!suportado || !texto.trim()) return
      window.speechSynthesis.cancel()
      const fala = new SpeechSynthesisUtterance(texto)
      fala.lang = 'pt-BR'
      fala.rate = 0.95
      fala.onend = () => setFalando(false)
      fala.onerror = () => setFalando(false)
      setFalando(true)
      window.speechSynthesis.speak(fala)
    },
    [suportado],
  )

  // Ao sair da tela, para de falar.
  useEffect(() => parar, [parar])

  return { suportado, falando, falar, parar }
}
