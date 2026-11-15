# LarOuAyê — Seu primeiro imóvel, sem juridiquês

Front-End da Global Solution FIAP 2026/2 (CitizenTech). Assistente gratuito e acessível que orienta, em linguagem simples,
a compra do primeiro imóvel (informação pública e jurídica geral).

## 1. Integrantes
Davi Felix · Fernando Oliveira (RM 570196) · Jonatan Feitosa · Marcelo da Mata · Vinícius Liberato — *(completar RMs)*

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
node mock/mock-api.mjs   # (opcional) API de mentira na :8080
```

## 9. Variáveis de ambiente
`VITE_API_URL`, `VITE_API_PREFIX`, `VITE_EMAIL_CONTATO` (ver `.env.example`).

## 10. Deploy
Vercel. O `vercel.json` repassa `/api/*` ao Java no Render (**troque `TROQUE-PELO-SEU-BACKEND` pela URL real**; evita CORS e erro de HTTPS) e redireciona o resto para `index.html` (evita 404 ao dar F5).
Veja também `ARQUITETURA.md` e `RECURSOS-OFICIAIS.md`.

## 11. Responsividade
Testado em 390×844, 768×1024 e 1440×900.

## 12. Links
Deploy: *(colar URL da Vercel)* · API Java: *(colar URL do Render)* · Vídeo: *(colar URL do YouTube)* · Repositório PÚBLICO: *(colar URL)*
