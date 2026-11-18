// Todo acesso à API Java passa por aqui: URL base, cabeçalhos, timeout, response.ok e erros.

// URL base vazia = mesma origem. Em desenvolvimento o Vite repassa /api ao Java (proxy, sem CORS);
// na Vercel o vercel.json repassa /api ao Render. Só preencha VITE_API_URL se NÃO usar esses repasses.
const URL_BASE = ((import.meta.env.VITE_API_URL as string | undefined) ?? '').replace(/\/+$/, '')

// Prefixo das rotas (o Plano Mestre usa /api; o roteiro não usa). Ajustável sem mexer no código.
export const PREFIXO_API = ((import.meta.env.VITE_API_PREFIX as string | undefined) ?? '/api').replace(
  /\/+$/,
  '',
)

// 90 s: servidores gratuitos (Render) levam até ~50 s para "acordar" na primeira chamada.
const TEMPO_LIMITE_MS = 90000

export class ApiError extends Error {
  status: number | null

  constructor(mensagem: string, status: number | null = null) {
    super(mensagem)
    this.name = 'ApiError'
    this.status = status
  }
}

type Metodo = 'GET' | 'POST' | 'PUT' | 'DELETE'

interface OpcoesRequisicao {
  metodo?: Metodo
  corpo?: unknown
  signal?: AbortSignal
  headers?: Record<string, string>
}

function mensagemPorStatus(status: number): string {
  if (status === 400 || status === 422) return 'Confira as informações enviadas e tente de novo.'
  if (status === 404) return 'Não encontramos o que você procurou.'
  if (status === 409) return 'Essa informação já existe.'
  if (status >= 500) return 'O servidor teve um problema. Tente de novo em alguns instantes.'
  return 'Não foi possível concluir. Tente de novo.'
}

// O Java pode devolver { mensagem } ou { message } ou um mapa campo -> mensagem
// (Bean Validation, como no exemplo do Plano Mestre). Aceitamos os três formatos.
function extrairMensagem(dados: unknown): string | undefined {
  if (!dados || typeof dados !== 'object') return undefined
  const objeto = dados as Record<string, unknown>
  if (typeof objeto.mensagem === 'string') return objeto.mensagem
  if (typeof objeto.message === 'string') return objeto.message
  const valores = Object.values(objeto)
  if (valores.length > 0 && valores.every((v) => typeof v === 'string')) return (valores as string[]).join(' ')
  return undefined
}

export async function requisicao<T>(caminho: string, opcoes: OpcoesRequisicao = {}): Promise<T> {
  const { metodo = 'GET', corpo, signal, headers } = opcoes
  const temCorpo = corpo !== undefined

  // Tempo de espera: sem isso, uma API fora do ar deixaria a tela carregando para sempre.
  const limite = AbortSignal.timeout(TEMPO_LIMITE_MS)
  const sinal = signal ? AbortSignal.any([signal, limite]) : limite

  let resposta: Response
  try {
    resposta = await fetch(`${URL_BASE}${caminho}`, {
      method: metodo,
      headers: {
        Accept: 'application/json',
        ...(temCorpo ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: temCorpo ? JSON.stringify(corpo) : undefined,
      signal: sinal,
    })
  } catch (erro) {
    if (limite.aborted) throw new ApiError('O servidor demorou demais para responder. Tente de novo.')
    // Cancelamento voluntário (AbortController) não é erro de rede: repassa.
    if (erro instanceof DOMException && erro.name === 'AbortError') throw erro
    // Sem internet, servidor fora do ar ou CORS bloqueado: o fetch rejeita.
    throw new ApiError('Não conseguimos falar com o servidor. Verifique a internet e tente de novo.')
  }

  // fetch NÃO rejeita em 4xx/5xx: é preciso olhar response.ok.
  if (!resposta.ok) {
    let detalhe: string | undefined
    try {
      detalhe = extrairMensagem(await resposta.json())
    } catch {
      // Resposta sem JSON: usamos a mensagem padrão do status.
    }
    throw new ApiError(detalhe ?? mensagemPorStatus(resposta.status), resposta.status)
  }

  // 204 No Content: não há corpo para ler.
  if (resposta.status === 204) return undefined as T

  return (await resposta.json()) as T
}

