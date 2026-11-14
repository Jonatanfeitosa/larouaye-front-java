import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type TamanhoFonte = 'normal' | 'grande' | 'maior'
const CHAVE = 'larouaye:fonte'
const ORDEM: TamanhoFonte[] = ['normal', 'grande', 'maior']

interface AcessibilidadeValor {
  leituraFacil: boolean
  altoContraste: boolean
  alternarLeituraFacil: () => void
  alternarAltoContraste: () => void
  fonte: TamanhoFonte
  aumentarFonte: () => void
  diminuirFonte: () => void
}

const Contexto = createContext<AcessibilidadeValor | null>(null)

function lerFonte(): TamanhoFonte {
  try {
    const salvo = localStorage.getItem(CHAVE)
    return ORDEM.includes(salvo as TamanhoFonte) ? (salvo as TamanhoFonte) : 'normal'
  } catch {
    return 'normal'
  }
}

function lerBool(chave: string): boolean {
  try {
    return localStorage.getItem(chave) === '1'
  } catch {
    return false
  }
}

export function AcessibilidadeProvider({ children }: { children: ReactNode }) {
  const [fonte, setFonte] = useState<TamanhoFonte>(lerFonte)
  const [leituraFacil, setLeituraFacil] = useState(() => lerBool('larouaye:facil'))
  const [altoContraste, setAltoContraste] = useState(() => lerBool('larouaye:contraste'))

  // Leitura fácil: mais espaço entre linhas e letras, linhas curtas. Alto contraste: preto sobre branco.
  useEffect(() => {
    document.documentElement.dataset.leitura = leituraFacil ? 'facil' : ''
    document.documentElement.dataset.contraste = altoContraste ? 'alto' : ''
    try {
      localStorage.setItem('larouaye:facil', leituraFacil ? '1' : '0')
      localStorage.setItem('larouaye:contraste', altoContraste ? '1' : '0')
    } catch {
      // ignora
    }
  }, [leituraFacil, altoContraste])

  // O CSS lê data-fonte no <html> e muda o tamanho base: tudo em rem acompanha.
  useEffect(() => {
    document.documentElement.dataset.fonte = fonte === 'normal' ? '' : fonte
    try {
      localStorage.setItem(CHAVE, fonte)
    } catch {
      // ignora
    }
  }, [fonte])

  const aumentarFonte = useCallback(
    () => setFonte((f) => ORDEM[Math.min(ORDEM.indexOf(f) + 1, ORDEM.length - 1)]),
    [],
  )
  const diminuirFonte = useCallback(() => setFonte((f) => ORDEM[Math.max(ORDEM.indexOf(f) - 1, 0)]), [])

  const alternarLeituraFacil = useCallback(() => setLeituraFacil((v) => !v), [])
  const alternarAltoContraste = useCallback(() => setAltoContraste((v) => !v), [])

  const valor = useMemo(
    () => ({ fonte, aumentarFonte, diminuirFonte, leituraFacil, altoContraste, alternarLeituraFacil, alternarAltoContraste }),
    [fonte, aumentarFonte, diminuirFonte, leituraFacil, altoContraste, alternarLeituraFacil, alternarAltoContraste],
  )
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAcessibilidade() {
  const ctx = useContext(Contexto)
  if (!ctx) throw new Error('useAcessibilidade precisa estar dentro de <AcessibilidadeProvider>')
  return ctx
}
