# LarOuAyê — Seu primeiro imóvel, sem juridiquês

Front-End da Global Solution FIAP 2026/2 (CitizenTech). Assistente gratuito e acessível que orienta, em linguagem simples,
a compra do primeiro imóvel (informação pública e jurídica geral).

## 1. Integrantes
| Integrante | RM |
|---|---|
| Davi Felix Cunha | *(RM a preencher)* |
| Fernando Oliveira Francelino Sardinha | 570196 |
| Jonatan Vieira Feitosa | 570452 |
| Marcelo Candido da Mata Junior | 569584 |
| Vinicius Liberato dos Anjos | 571480 |

## 2. Problema e solução
Quem tem pouca informação enfrenta documentos e termos jurídicos difíceis ao comprar o primeiro imóvel. O LarOuAyê explica
etapas, documentos e cuidados, com leitura em voz alta e interface simples. ODS 10 e 11.

## 3. Arquitetura
React ⇄ API Java (Spring Boot + Oracle, regras e catálogo jurídico) ⇄ Flask (2 modelos de ML). O React só fala com o Java.
**A IA identifica, o Java decide, o conteúdo jurídico fundamenta.** Veja `CONTRATO-API.md`.

## 4. Tecnologias
React 19 · Vite · TypeScript · Tailwind CSS 4 · React Router 7 · React Hook Form + Zod · Fetch API nativa (sem Axios) · Vercel.

## 5. Páginas
Home, Integrantes, Sobre, FAQ, Contato (institucionais) + Assistente e Minha jornada (solução) + rota dinâmica `/integrantes/:id`.

## 6. Acessibilidade
Semântica (header, nav, main, section), link "pular para o conteúdo", foco movido ao trocar de página, resumo de erros
com foco, `aria-live` no chat, leitura em voz alta (speechSynthesis), letra ajustável, navegação por teclado, contraste AA.

## 7. Estados de tela
Todas as telas com dados têm: carregando (skeleton), erro (com "Tentar de novo"), vazio e sucesso.

## 8. Como rodar
```bash
npm install
cp .env.example .env     # (opcional) ajuste VITE_PROXY_TARGET
npm run dev              # http://localhost:5173 (o Vite repassa /api ao Java, sem CORS)
node mock/mock-api.mjs   # (opcional, só desenvolvimento/testes) API de mentira na :8080; a entrega usa a API Java real
npm test                 # testes (Vitest)
npm run build            # gera dist/
```

## 9. Variáveis de ambiente
`VITE_API_URL`, `VITE_API_PREFIX`, `VITE_EMAIL_CONTATO` (ver `.env.example`).

## 10. Deploy
<<<<<<< HEAD
Vercel. O `vercel.json` repassa `/api/*` ao Java no Render (hoje aponta para `https://larouaye-api.onrender.com`; evita CORS e erro de HTTPS) e redireciona o resto para `index.html` (evita 404 ao dar F5).
=======
Vercel. O `vercel.json` repassa `/api/*` ao Java no Render (**troque `larouaye-api.onrender.com` pela URL real**; evita CORS e erro de HTTPS) e redireciona o resto para `index.html` (evita 404 ao dar F5).
>>>>>>> origin/develop
Veja também `ARQUITETURA.md` e `RECURSOS-OFICIAIS.md`.

## 11. Responsividade
Testado em 390×844, 768×1024 e 1440×900.

## 12. Links
- Repositório PÚBLICO: *(colar a URL exata, ex.: https://github.com/tecnando-rpa/larouaye)*
- Deploy (Vercel): *(colar URL)*
- API Java (Render): https://larouaye-api.onrender.com
- Vídeo (YouTube, até 3 min): *(colar URL)*
- Contato: fernando.oliveira.francelino@gmail.com

## 13. Uso de IA
Ferramentas de IA generativa foram usadas como apoio (revisão de acessibilidade e testes); código revisado e testado pelo grupo.
