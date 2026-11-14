import { useCallback, useRef, useState } from 'react'

// Ditado por voz (SpeechRecognition do navegador). Extra: funciona no Chrome e no Edge, não em todos.
interface Reconhecedor {
  lang: string
  interimResults: boolean
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  start: () => void
  stop: () => void
}
type Construtor = new () => Reconhecedor

function obterConstrutor(): Construtor | undefined {
  if (typeof window === 'undefined') return undefined
  const w = window as unknown as { SpeechRecognition?: Construtor; webkitSpeechRecognition?: Construtor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

export function useReconhecimentoVoz(aoOuvir: (texto: string) => void) {
  const suportado = obterConstrutor() !== undefined
  const [ouvindo, setOuvindo] = useState(false)
  const ref = useRef<Reconhecedor | null>(null)

  const parar = useCallback(() => {
    ref.current?.stop()
    setOuvindo(false)
  }, [])

  const ouvir = useCallback(() => {
    const Construtor = obterConstrutor()
    if (!Construtor) return
    const r = new Construtor()
    r.lang = 'pt-BR'
    r.interimResults = false
    r.onresult = (e) => aoOuvir(e.results[0][0].transcript)
    r.onend = () => setOuvindo(false)
    r.onerror = () => setOuvindo(false)
    ref.current = r
    setOuvindo(true)
    r.start()
  }, [aoOuvir])

  return { suportado, ouvindo, ouvir, parar }
}
