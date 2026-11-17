
import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { escolherVoz, prepararTexto, useLeituraEmVoz } from './useLeituraEmVoz'

const cancelarVoz = vi.fn()
const reproduzirVoz = vi.fn<(fala: SpeechSynthesisUtterance) => void>()

class FalaSimulada {
  text: string
  lang = ''
  rate = 1
  pitch = 1
  voice: unknown = null
  onend: (() => void) | null = null
  onerror: (() => void) | null = null

  constructor(texto: string) {
    this.text = texto
  }
}

beforeEach(() => {
  vi.clearAllMocks()

  vi.stubGlobal('speechSynthesis', {
    cancel: cancelarVoz,
    speak: reproduzirVoz,
  })

  vi.stubGlobal('SpeechSynthesisUtterance', FalaSimulada)
})

afterEach(() => {
  // Desmonta os hooks antes de remover a API de voz simulada.
  cleanup()
  vi.unstubAllGlobals()
})

describe('useLeituraEmVoz', () => {
  it('identifica suporte a sintese de voz', () => {
    const { result } = renderHook(() => useLeituraEmVoz())

    expect(result.current.suportado).toBe(true)
    expect(result.current.falando).toBe(false)
  })

  it('reproduz texto em portugues brasileiro', () => {
    const { result } = renderHook(() => useLeituraEmVoz())

    act(() => {
      result.current.falar('Orientacoes para comprar um imovel')
    })

    expect(reproduzirVoz).toHaveBeenCalledTimes(1)

    const fala = reproduzirVoz.mock.calls[0][0]

    expect(fala.text).toBe('Orientacoes para comprar um imovel')
    expect(fala.lang).toBe('pt-BR')
    expect(fala.rate).toBe(0.9)
    expect(result.current.falando).toBe(true)
  })

  it('nao reproduz textos vazios', () => {
    const { result } = renderHook(() => useLeituraEmVoz())

    act(() => {
      result.current.falar('   ')
    })

    expect(reproduzirVoz).not.toHaveBeenCalled()
    expect(result.current.falando).toBe(false)
  })

  it('interrompe a leitura quando solicitado', () => {
    const { result } = renderHook(() => useLeituraEmVoz())

    act(() => {
      result.current.falar('Texto de exemplo')
    })

    expect(result.current.falando).toBe(true)

    act(() => {
      result.current.parar()
    })

    expect(cancelarVoz).toHaveBeenCalled()
    expect(result.current.falando).toBe(false)
  })

  it('atualiza o estado quando a leitura termina', () => {
    const { result } = renderHook(() => useLeituraEmVoz())

    act(() => {
      result.current.falar('Texto de exemplo')
    })

    const fala = reproduzirVoz.mock.calls[0][0]

    act(() => {
      fala.onend?.(
        new Event('end') as SpeechSynthesisEvent,
      )
    })

    expect(result.current.falando).toBe(false)
  })

  it('atualiza o estado quando ocorre erro na leitura', () => {
    const { result } = renderHook(() => useLeituraEmVoz())

    act(() => {
      result.current.falar('Texto de exemplo')
    })

    const fala = reproduzirVoz.mock.calls[0][0]

    act(() => {
      fala.onerror?.(
        new Event('error') as SpeechSynthesisErrorEvent,
      )
    })

    expect(result.current.falando).toBe(false)
  })

  it('interrompe a leitura quando o componente e desmontado', () => {
    const { result, unmount } = renderHook(() => useLeituraEmVoz())

    act(() => {
      result.current.falar('Texto de exemplo')
    })

    cancelarVoz.mockClear()

    unmount()

    expect(cancelarVoz).toHaveBeenCalledTimes(1)
  })
})

describe('prepararTexto', () => {
  it('tira emojis e abre abreviações jurídicas', () => {
    const [bloco] = prepararTexto('🔊 Veja o art. 5º e a Lei nº 8.245 do § 2')
    expect(bloco).not.toMatch(/🔊/)
    expect(bloco).toContain('artigo 5º')
    expect(bloco).toContain('número 8.245')
    expect(bloco).toContain('parágrafo 2')
  })

  it('quebra textos longos em blocos curtos e ignora texto vazio', () => {
    const longo = Array.from({ length: 12 }, (_, i) => `Esta é a frase número ${i} do texto.`).join(' ')
    const blocos = prepararTexto(longo)
    expect(blocos.length).toBeGreaterThan(1)
    expect(blocos.every((b) => b.length < 260)).toBe(true)
    expect(prepararTexto('  🔊  ')).toEqual([])
  })
})

describe('escolherVoz', () => {
  const voz = (name: string, lang: string) => ({ name, lang }) as SpeechSynthesisVoice

  it('prefere a voz natural em português do Brasil', () => {
    const escolhida = escolherVoz([
      voz('Microsoft Daniel - Portuguese (Brazil)', 'pt-BR'),
      voz('Microsoft Francisca Online (Natural) - Portuguese (Brazil)', 'pt-BR'),
      voz('Google US English', 'en-US'),
    ])
    expect(escolhida?.name).toContain('Francisca Online')
  })

  it('cai para outra voz em português e devolve vazio se não houver', () => {
    expect(escolherVoz([voz('Joana', 'pt-PT')])?.name).toBe('Joana')
    expect(escolherVoz([voz('Samantha', 'en-US')])).toBeUndefined()
  })
})
