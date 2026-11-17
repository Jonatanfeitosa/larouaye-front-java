import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Casinha } from './Casinha'

describe('Casinha (mascote)', () => {
  it('é decorativa: escondida do leitor de tela', () => {
    const { container } = render(<Casinha />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
  it('a boca só mexe quando está falando', () => {
    const parada = render(<Casinha />)
    expect(parada.container.querySelector('.casinha-boca-fala')).toBeNull()
    parada.unmount()
    const falando = render(<Casinha falando />)
    expect(falando.container.querySelector('.casinha-boca-fala')).not.toBeNull()
  })
  it('a fumacinha só aparece quando está pensando', () => {
    const quieta = render(<Casinha />)
    expect(quieta.container.querySelector('[data-fumaca]')).toBeNull()
    quieta.unmount()
    const pensando = render(<Casinha pensando />)
    expect(pensando.container.querySelectorAll('.casinha-fumaca')).toHaveLength(3)
    expect(pensando.container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
  it('aceita tamanho personalizado', () => {
    const { container } = render(<Casinha className="h-10 w-10" />)
    expect(container.querySelector('svg')).toHaveClass('h-10')
  })
})
