# Mapa de rotas

O site é uma SPA com React Router 7. Rotas estáticas e **uma rota dinâmica com parâmetro** (exigência da FIAP).

| Endereço | Página | Tipo | Dados da API |
|---|---|---|---|
| `/` | Início | estática | não |
| `/assistente` | Assistente jurídico (chat) | estática | POST e GET `/usuarios/{id}/consultas` |
| `/jornada` | Minha jornada | estática | GET `/etapas`, GET e POST `/usuarios/{id}/etapas` |
| `/faq` | Dúvidas frequentes | estática | GET `/orientacoes` |
| `/sobre` | Sobre | estática | não |
| `/integrantes` | Integrantes | estática | não |
| `/integrantes/:id` | Detalhe do integrante | **dinâmica** | não |
| `/contato` | Contato | estática | não |
| `*` | Página não encontrada | curinga | não |

## Páginas da exigência da FIAP
- **5 institucionais:** Início, Integrantes, Sobre, Dúvidas (FAQ) e Contato.
- **Pelo menos 2 da solução:** Assistente e Minha jornada.

## Regras
- Todas as páginas ficam dentro do `RootLayout` (menu, barra de acessibilidade, `main`, rodapé).
- Cada página muda o título da aba com `useTituloPagina`.
- No deploy (Vercel), o `vercel.json` manda qualquer endereço para `index.html`, por isso recarregar `/jornada` não dá 404.
- Os testes em `src/routes/router.test.tsx` abrem cada rota e conferem o título.
