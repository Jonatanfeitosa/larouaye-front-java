import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it } from 'vitest'
import { UsuarioProvider, useUsuario } from './UsuarioContext'

const envolver = ({ children }: { children: ReactNode }) => <UsuarioProvider>{children}</UsuarioProvider>

beforeEach(() => localStorage.clear())

describe('UsuarioContext', () => {
  it('começa sem usuário', () => {
    const { result } = renderHook(() => useUsuario(), { wrapper: envolver })
    expect(result.current.usuario).toBeNull()
  })

  it('entrar guarda só id e nome e lembra depois de recarregar', () => {
    const { result, unmount } = renderHook(() => useUsuario(), { wrapper: envolver })
    act(() => result.current.entrar({ id: 7, nome: 'Ana' }))
    expect(JSON.parse(localStorage.getItem('larouaye:usuario') ?? '{}')).toEqual({ id: 7, nome: 'Ana' })
    unmount()
    const outro = renderHook(() => useUsuario(), { wrapper: envolver })
    expect(outro.result.current.usuario).toEqual({ id: 7, nome: 'Ana' })
  })

  it('sair apaga o que foi guardado', () => {
    const { result } = renderHook(() => useUsuario(), { wrapper: envolver })
    act(() => result.current.entrar({ id: 1, nome: 'Ana' }))
    act(() => result.current.sair())
    expect(result.current.usuario).toBeNull()
    expect(localStorage.getItem('larouaye:usuario')).toBeNull()
  })

  it('ignora dado guardado corrompido', () => {
    localStorage.setItem('larouaye:usuario', '{quebrado')
    const { result } = renderHook(() => useUsuario(), { wrapper: envolver })
    expect(result.current.usuario).toBeNull()
  })

  it('dá erro claro fora do Provider', () => {
    expect(() => renderHook(() => useUsuario())).toThrow('UsuarioProvider')
  })
})
