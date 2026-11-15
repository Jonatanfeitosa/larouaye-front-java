import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderNaRota } from '../test/ajudantes'
import { Contato } from './Contato'

describe('Contato', () => {
  it('formulário vazio: mostra o resumo de erros e dá foco nele', async () => {
    renderNaRota(<Contato />)
    await userEvent.click(screen.getByRole('button', { name: 'Enviar mensagem' }))
    const resumo = await screen.findByRole('alert')
    expect(resumo).toHaveFocus()
    expect(screen.getByLabelText('Nome')).toHaveAttribute('aria-invalid', 'true')
  })

  it('formulário válido: mostra mensagem de sucesso honesta (sem fingir envio)', async () => {
    renderNaRota(<Contato />)
    await userEvent.type(screen.getByLabelText('Nome'), 'Ana Souza')
    await userEvent.type(screen.getByLabelText('E-mail'), 'ana@exemplo.com')
    await userEvent.type(screen.getByLabelText('Assunto'), 'Sugestão')
    await userEvent.type(screen.getByLabelText('Mensagem'), 'Gostei muito do site, parabéns.')
    await userEvent.click(screen.getByRole('button', { name: 'Enviar mensagem' }))
    expect(await screen.findByRole('status')).toHaveTextContent(/demonstração|e-mail/i)
    expect(screen.getByLabelText('Nome')).toHaveValue('')
  })
})
