// API Java de MENTIRA, só para desenvolver/testar o front enquanto o Jonatan não publica a real.
// Rode: node mock/mock-api.mjs   (porta 8080; para outra porta: PORT=8099 node mock/mock-api.mjs). O catálogo é rascunho: precisa de revisão jurídica antes de valer.
import { readFileSync } from 'node:fs'
import { createServer } from 'node:http'

const PORTA = Number(process.env.PORT) || 8080

// Catálogo real (rascunho revisável) em docs/catalogo/orientacoes.json. Em produção, vem do Oracle via Java.
const orientacoes = JSON.parse(readFileSync(new URL('../docs/catalogo/orientacoes.json', import.meta.url), 'utf8'))
const semAcento = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const PALAVRAS = {
  1: ['consorcio'], 2: ['bolso', 'quanto posso', 'valor maximo', 'renda'], 3: ['documentacao legal', 'documentacao'],
  4: ['financiamento', 'financiar'], 5: ['herdeiro', 'casal', 'familia', 'heranca'], 6: ['amortiz', 'quitar', 'adiantar'],
  7: ['banco'], 8: ['itbi', 'emolumento', 'imposto', 'regularizar', 'custos', 'escritura', 'registro'], 9: ['certidao', 'certidoes', 'documentos', 'divida', 'onus', 'matricula', 'vendedor'],
  10: ['subsidio', '5 anos'], 11: ['avaliar', 'avaliacao', 'avaliado'],
}
function acharOrientacao(pergunta) {
  const p = semAcento(pergunta)
  const exata = orientacoes.find((o) => semAcento(o.perguntaRelacionada ?? '') === p)
  if (exata) return exata
  const ordem = [10, 11, 6, 5, 1, 8, 9, 2, 7, 4, 3]
  const id = ordem.find((i) => PALAVRAS[i].some((k) => p.includes(k)))
  return orientacoes.find((o) => o.id === id)
}
const etapas = [
  { id: 1, codigo: 'PESQUISA_IMOVEL', ordem: 1, nome: 'Pesquisa e escolha do imóvel', descricao: 'Descrição de exemplo.', documentos: ['Documento de exemplo'] },
  { id: 2, codigo: 'ANALISE_DOCUMENTAL', ordem: 2, nome: 'Análise documental', descricao: 'Descrição de exemplo.', cuidados: ['Cuidado de exemplo'] },
]
const progresso = new Map()
const historico = []
let proximoUsuario = 1
let proximaConsulta = 100

function corpo(req) {
  return new Promise((ok) => {
    let b = ''
    req.on('data', (c) => (b += c))
    req.on('end', () => ok(b ? JSON.parse(b) : {}))
  })
}

createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  if (req.method === 'OPTIONS') return res.writeHead(204).end()
  res.setHeader('Content-Type', 'application/json')
  const url = req.url ?? ''
  const json = (s, d) => res.writeHead(s).end(JSON.stringify(d))

  if (url === '/api/saude') return json(200, { status: 'UP' })
  if (url === '/api/orientacoes') return json(200, orientacoes)
  if (url === '/api/etapas') return json(200, etapas)
  if (url === '/api/usuarios' && req.method === 'POST') {
    const d = await corpo(req)
    if (!d.nome) return json(400, { nome: 'Nome é obrigatório' })
    return json(201, { id: proximoUsuario++, nome: d.nome })
  }
  let m = url.match(/^\/api\/usuarios\/(\d+)\/consultas$/)
  if (m && req.method === 'GET') return json(200, historico)
  if (m && req.method === 'POST') {
    const d = await corpo(req)
    if (d.pergunta.includes('erro500')) return json(500, {})
    const id = proximaConsulta++
    historico.push({ consultaId: id, pergunta: d.pergunta, categoria: 'DOCUMENTACAO', dataConsulta: '2026-11-12' })
    if (d.pergunta.includes('confusa')) return json(200, { consultaId: id, status: 'ESCLARECIMENTO', opcoes: ['Documentação', 'Contrato'] })
    if (d.pergunta.includes('desconhecida')) return json(200, { consultaId: id, status: 'NAO_RECONHECIDA' })
    const o = acharOrientacao(d.pergunta)
    if (!o) return json(200, { consultaId: id, status: 'NAO_RECONHECIDA' })
    const { id: orientacaoId, titulo, conteudo, cuidados, baseLegal, dataRevisao } = o
    return json(201, {
      consultaId: id, status: 'RESPONDIDA', categoria: o.categoria, orientacaoId,
      resposta: { titulo, conteudo, cuidados, baseLegal, dataRevisao },
      proximaEtapa: 'Análise documental',
    })
  }
  m = url.match(/^\/api\/usuarios\/(\d+)\/etapas$/)
  if (m && req.method === 'GET') return json(200, [...progresso].map(([etapaId, status]) => ({ etapaId, status })))
  if (m && req.method === 'POST') {
    const d = await corpo(req)
    progresso.set(d.etapaId, d.status)
    return json(200, { etapaId: d.etapaId, status: d.status })
  }
  json(404, { mensagem: 'Recurso não encontrado.' })
}).listen(PORTA, () => console.log(`mock em :${PORTA}`))
