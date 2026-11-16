# Variáveis de ambiente

Arquivo modelo: `.env.example`. Copie para `.env` (que **nunca** vai para o GitHub) e ajuste.

| Variável | Para que serve | Quando preencher |
|---|---|---|
| `VITE_PROXY_TARGET` | Para onde o Vite repassa `/api` em desenvolvimento | Padrão `http://localhost:8080` (Java ou mock) |
| `VITE_API_URL` | Endereço do back-end, se o site chamar o Java direto | Normalmente **vazio**. Só use se não houver repasse (exige CORS no Java) |
| `VITE_API_PREFIX` | Prefixo das rotas do Java | Padrão `/api` |
| `VITE_EMAIL_CONTATO` | E-mail que recebe a mensagem do formulário de Contato | Opcional. Vazio = modo demonstração |

## Regras
- Variáveis `VITE_*` ficam **visíveis** no navegador. Nunca coloque senha, chave ou token nelas.
- Mudou o `.env`? Reinicie o `npm run dev`.
- Na Vercel, as variáveis são cadastradas no painel do projeto e valem para o próximo deploy.
- O `.gitignore` já protege `.env`. Confira com `git status` antes de cada commit.
