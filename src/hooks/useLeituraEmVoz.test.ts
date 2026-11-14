
import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useLeituraEmVoz } from './useLeituraEmVoz'

const cancelarVoz = vi.fn()
const reproduzirVoz = vi.fn<(fala: SpeechSynthesisUtterance) => void>()

class FalaSimulada {
  text: string
  lang = ''
  rate = 1
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
    expect(fala.rate).toBe(0.95)
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
