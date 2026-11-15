
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { UsuarioProvider } from '../contexts/UsuarioContext'
import { Jornada } from './Jornada'

const {
  listarEtapasFalso,
  listarProgressoFalso,
  salvarProgressoFalso,
} = vi.hoisted(() => ({
  listarEtapasFalso: vi.fn(),
  listarProgressoFalso: vi.fn(),
  salvarProgressoFalso: vi.fn(),
}))

vi.mock('../services/etapaService', () => ({
  listarEtapas: listarEtapasFalso,
  listarProgresso: listarProgressoFalso,
  salvarProgresso: salvarProgressoFalso,
}))

const etapas = [
  {
    id: 2,
    codigo: 'ANALISE_DOCUMENTAL',
    ordem: 2,
    nome: 'Análise documental',
    descricao: 'Confira os documentos do imóvel.',
    documentos: ['Matrícula atualizada'],
    cuidados: ['Verificar possíveis restrições'],
  },
  {
    id: 1,
    codigo: 'PESQUISA_IMOVEL',
    ordem: 1,
    nome: 'Pesquisa do imóvel',
    descricao: 'Escolha o imóvel adequado.',
    fontes: [
      {
        titulo: 'Fonte oficial',
        url: 'https://www.gov.br/',
      },
    ],
  },
]

function identificarUsuario() {
  localStorage.setItem(
    'larouaye:usuario',
    JSON.stringify({ id: 10, nome: 'Ana' }),
  )
}

function renderizarJornada() {
  return render(
    <UsuarioProvider>
      <Jornada />
    </UsuarioProvider>,
  )
}

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()

  listarEtapasFalso.mockResolvedValue(etapas)
  listarProgressoFalso.mockResolvedValue([
    { etapaId: 1, status: 'CONCLUIDA' },
    { etapaId: 2, status: 'PENDENTE' },
  ])
})

describe('Jornada', () => {
  it('solicita identificacao quando nao existe usuario', () => {
    renderizarJornada()

    expect(
      screen.getByRole('heading', {
        name: /minha jornada de compra/i,
      }),
    ).toBeInTheDocument()

    expect(listarEtapasFalso).not.toHaveBeenCalled()
    expect(listarProgressoFalso).not.toHaveBeenCalled()
  })

  it('mostra carregamento enquanto consulta a API', () => {
    identificarUsuario()

    listarEtapasFalso.mockImplementation(
      () => new Promise(() => {}),
    )

    renderizarJornada()

    expect(
      screen.getByText(/carregando sua jornada/i),
    ).toBeInTheDocument()
  })

  it('exibe as etapas na ordem correta', async () => {
    identificarUsuario()
    renderizarJornada()

    const primeira = await screen.findByRole('heading', {
      name: /1\. pesquisa do imóvel/i,
    })

    const segunda = screen.getByRole('heading', {
      name: /2\. análise documental/i,
    })

    expect(
      primeira.compareDocumentPosition(segunda) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()

    expect(
      screen.getByText('Matrícula atualizada'),
    ).toBeInTheDocument()

    expect(
      screen.getByText('Verificar possíveis restrições'),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', { name: /fonte oficial/i }),
    ).toHaveAttribute('href', 'https://www.gov.br/')
  })

  it('mostra o progresso recuperado do servidor', async () => {
    identificarUsuario()
    renderizarJornada()

    expect(
      await screen.findByText(/1 de 2 etapas concluídas/i),
    ).toBeInTheDocument()

    expect(listarProgressoFalso).toHaveBeenCalledWith(
      10,
      expect.any(AbortSignal),
    )
  })

  it('mostra mensagem quando nao existem etapas', async () => {
    identificarUsuario()
    listarEtapasFalso.mockResolvedValue([])

    renderizarJornada()

    expect(
      await screen.findByText(/etapas ainda não cadastradas/i),
    ).toBeInTheDocument()
  })

  it('informa quando ocorre erro ao carregar etapas', async () => {
    identificarUsuario()
    listarEtapasFalso.mockRejectedValue(
      new Error('Falha na consulta das etapas'),
    )

    renderizarJornada()

    expect(
      await screen.findByText('Falha na consulta das etapas'),
    ).toBeInTheDocument()
  })

  it('salva a alteracao do progresso na API', async () => {
    identificarUsuario()

    salvarProgressoFalso.mockResolvedValue({
      etapaId: 2,
      status: 'CONCLUIDA',
    })

    renderizarJornada()

    const titulo = await screen.findByRole('heading', {
      name: /2\. análise documental/i,
    })

    const item = titulo.closest('li')
    expect(item).not.toBeNull()

    const botao = within(item!).getByRole('button', {
      name: 'Concluída',
    })

    fireEvent.click(botao)

    await waitFor(() => {
      expect(salvarProgressoFalso).toHaveBeenCalledWith(
        10,
        2,
        'CONCLUIDA',
      )
    })

    expect(
      await screen.findByText(/2 de 2 etapas concluídas/i),
    ).toBeInTheDocument()

    expect(botao).toHaveAttribute('aria-pressed', 'true')
  })

  it('mostra erro quando nao consegue salvar progresso', async () => {
    identificarUsuario()

    salvarProgressoFalso.mockRejectedValue(
      new Error('Não foi possível salvar o progresso'),
    )

    renderizarJornada()

    const titulo = await screen.findByRole('heading', {
      name: /2\. análise documental/i,
    })

    const item = titulo.closest('li')
    expect(item).not.toBeNull()

    fireEvent.click(
      within(item!).getByRole('button', {
        name: 'Concluída',
      }),
    )

    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent(
      'Não foi possível salvar o progresso',
    )

    expect(
      screen.getByText(/1 de 2 etapas concluídas/i),
    ).toBeInTheDocument()
  })
})
