# Testes automáticos

Usamos **Vitest** com **Testing Library**. Eles simulam o navegador (jsdom) e usam a tela como a pessoa usa: pelo texto, pelo rótulo e pelo papel (botão, alerta, link), o que também confere a acessibilidade.

## Rodar
```bash
npm test          # roda tudo uma vez
npx vitest        # fica observando e roda de novo ao salvar
```

## O que existe
| Tipo | Onde | O que confere |
|---|---|---|
| Serviços | `src/services/*.test.ts` | rota, método e corpo de cada chamada à API (fetch simulado) |
| Schemas | `src/schemas/*.test.ts` | regras de validação e mensagens em português |
| Hooks e contextos | `src/hooks`, `src/contexts` | 4 estados de tela, usuário salvo, letra e contraste |
| Componentes | `src/components/*.test.tsx` | rótulos, `aria-*`, foco e estados |
| Páginas | `src/pages/*.test.tsx` | carregando, erro, vazio e sucesso de cada tela |
| Rotas | `src/routes/router.test.tsx` | cada endereço abre a página certa e a 404 existe |
| Deploy | `tests/deploy.test.ts` | `vercel.json`, `.env.example` e `.gitignore` |
| Mock da API | `mock/mock-api.test.ts` | sobe o mock de verdade na porta 8080 |

## Regras do grupo
- Cada pessoa mantém os testes dos **próprios** arquivos.
- Todo bug corrigido ganha um teste que o reproduz.
- Antes de abrir o Pull Request: `npm run build`, `npm run lint` e `npm test` sem erro.
- O teste do mock usa a porta **8080**: feche o mock antes de rodar `npm test`.
