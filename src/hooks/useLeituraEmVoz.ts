import { useCallback, useEffect, useState } from 'react'

// Leitura em voz alta com a API nativa do navegador (speechSynthesis). Sem biblioteca.
// Nem todo navegador tem voz em português: por isso o recurso é um EXTRA, nunca o único caminho.

// Vozes em ordem de preferência: as "naturais" (Microsoft Edge) e as do Google são as mais
// agradáveis; depois as vozes femininas e calmas do sistema (Windows, macOS, Android).
const PREFERIDAS = [/francisca.*(online|natural)/i, /thalita.*(online|natural)/i, /online|natural/i, /google.*portugu/i, /francisca|thalita|luciana|camila|maria/i]

export function escolherVoz(vozes: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const brasileiras = vozes.filter((v) => /^pt[-_]br$/i.test(v.lang))
  const portuguesas = brasileiras.length > 0 ? brasileiras : vozes.filter((v) => /^pt/i.test(v.lang))
  for (const padrao of PREFERIDAS) {
    const achada = portuguesas.find((v) => padrao.test(v.name))
    if (achada) return achada
  }
  return portuguesas[0]
}

// Deixa o texto "falável": tira emojis e símbolos que o leitor soletra e abre abreviações do texto jurídico.
// Depois quebra em frases curtas: a voz respira entre elas, e o Chrome não corta leituras longas.
export function prepararTexto(texto: string): string[] {
  const limpo = texto
    .replace(/\p{Extended_Pictographic}|\u{200D}|\u{FE0F}|[⏹▶]/gu, ' ')
    .replace(/\bart\.\s*/gi, 'artigo ')
    .replace(/\barts\.\s*/gi, 'artigos ')
    .replace(/\bn[º°o]\.?\s*(?=\d)/gi, 'número ')
    .replace(/§\s*/g, 'parágrafo ')
    .replace(/\s*[|•·]\s*/g, '. ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!limpo) return []
  const frases = limpo.split(/(?<=[.!?:;])\s+/)
  const blocos: string[] = []
  for (const frase of frases) {
    const ultimo = blocos[blocos.length - 1]
    if (ultimo !== undefined && ultimo.length + frase.length < 160) blocos[blocos.length - 1] = `${ultimo} ${frase}`
    else blocos.push(frase)
  }
  return blocos
}

export function useLeituraEmVoz() {
  const suportado = typeof window !== 'undefined' && 'speechSynthesis' in window
  const [falando, setFalando] = useState(false)
  const [voz, setVoz] = useState<SpeechSynthesisVoice | undefined>()

  // As vozes chegam depois que a página carrega: escutamos o evento para pegar a melhor.
  useEffect(() => {
    if (!suportado || typeof window.speechSynthesis.getVoices !== 'function') return
    const atualizar = () => setVoz(escolherVoz(window.speechSynthesis.getVoices()))
    atualizar()
    window.speechSynthesis.addEventListener?.('voiceschanged', atualizar)
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', atualizar)
  }, [suportado])

  const parar = useCallback(() => {
    if (!suportado) return
    window.speechSynthesis.cancel()
    setFalando(false)
  }, [suportado])

  const falar = useCallback(
    (texto: string) => {
      const blocos = prepararTexto(texto)
      if (!suportado || blocos.length === 0) return
      window.speechSynthesis.cancel()
      setFalando(true)
      blocos.forEach((bloco, i) => {
        const fala = new SpeechSynthesisUtterance(bloco)
        fala.lang = 'pt-BR'
        fala.rate = 0.9 // um pouco mais devagar: quem lê com dificuldade acompanha melhor
        fala.pitch = 1.05 // tom levemente mais caloroso
        if (voz) fala.voice = voz
        fala.onerror = () => setFalando(false)
        if (i === blocos.length - 1) fala.onend = () => setFalando(false)
        window.speechSynthesis.speak(fala)
      })
    },
    [suportado, voz],
  )

  // Ao sair da tela, para de falar.
  useEffect(() => parar, [parar])
  return { suportado, falando, falar, parar }
}
