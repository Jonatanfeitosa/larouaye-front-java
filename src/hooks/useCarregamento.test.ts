import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useCarregamento } from './useCarregamento'

const vazio = (d: unknown[]) => d.length === 0

describe('useCarregamento (4 estados de tela)', () => {
  it('começa carregando e termina em sucesso', async () => {
    const buscar = vi.fn().mockResolvedValue([1, 2])
    const { result } = renderHook(() => useCarregamento(buscar, vazio))
    expect(result.current.estado.status).toBe('carregando')
    await waitFor(() => expect(result.current.estado.status).toBe('sucesso'))
  })

  it('vai para vazio quando a lista chega sem itens', async () => {
    const { result } = renderHook(() => useCarregamento(() => Promise.resolve([] as unknown[]), vazio))
    await waitFor(() => expect(result.current.estado.status).toBe('vazio'))
  })

  it('vai para erro com a mensagem e permite tentar de novo', async () => {
    const buscar = vi.fn().mockRejectedValueOnce(new Error('Servidor fora do ar')).mockResolvedValueOnce([1])
    const { result } = renderHook(() => useCarregamento(buscar, vazio))
    await waitFor(() => expect(result.current.estado).toEqual({ status: 'erro', mensagem: 'Servidor fora do ar' }))
    act(() => result.current.recarregar())
    await waitFor(() => expect(result.current.estado.status).toBe('sucesso'))
    expect(buscar).toHaveBeenCalledTimes(2)
  })

  it('não mostra erro quando a busca é cancelada ao sair da tela', async () => {
    const buscar = vi.fn().mockRejectedValue(new DOMException('x', 'AbortError'))
    const { result, unmount } = renderHook(() => useCarregamento(buscar, vazio))
    unmount()
    await Promise.resolve()
    expect(result.current.estado.status).toBe('carregando')
  })
})
