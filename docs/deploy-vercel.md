# Deploy na Vercel (passo a passo)

## Antes
- O repositório do GitHub precisa estar **público**. Teste abrindo o link em janela anônima.
- `npm run build` e `npm test` passam na sua máquina.

## Publicar
1. Entre em vercel.com com a conta do GitHub e clique em **Add New, Project**.
2. Escolha o repositório `larouaye`. O Vercel detecta Vite sozinho.
3. Confirme: Build Command `npm run build`, Output Directory `dist`.
4. Em **Environment Variables**, preencha o que for necessário (veja `docs/variaveis-ambiente.md`).
5. Clique em **Deploy** e copie o endereço final para o README.

## Back-end (Render)
O `vercel.json` já manda as chamadas `/api` do site para o Java publicado no Render (`larouaye-api.onrender.com`). Assim não há erro de CORS. Se o endereço do Java mudar, troque só esse trecho do `vercel.json`.

## Conferir depois
- [ ] Abra o site e dê **F5 em `/jornada`**: precisa abrir a página, não um erro 404.
- [ ] Com o back-end no ar, cadastre um nome e faça uma pergunta.
- [ ] A primeira chamada pode demorar até ~50 s (o Render gratuito "acorda"): o aviso **Conectando ao servidor** deve aparecer.
- [ ] Teste em janela anônima e no celular.

## Se algo der errado
| Sintoma | Causa provável |
|---|---|
| 404 ao recarregar uma página | `vercel.json` sem a regra de `index.html` |
| Chamadas à API falham com erro de rede | endereço do back-end errado no `vercel.json` |
| Página em branco | erro de build: leia o log do deploy |
