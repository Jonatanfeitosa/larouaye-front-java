# Desempenho e boas práticas (Lighthouse)

O Lighthouse do Chrome mede desempenho, acessibilidade, boas práticas e SEO.

## Como rodar
1. Abra o site publicado em janela anônima (sem extensões).
2. F12, aba **Lighthouse**, modo **Mobile**, marque as 4 categorias, **Analyze page load**.
3. Anote as notas na tabela abaixo e salve o relatório.

| Página | Desempenho | Acessibilidade | Boas práticas | SEO |
|---|---|---|---|---|
| Início | a preencher | a preencher | a preencher | a preencher |
| Assistente | a preencher | a preencher | a preencher | a preencher |
| Dúvidas | a preencher | a preencher | a preencher | a preencher |

## O que o projeto já faz para ir bem
- `lang="pt-BR"`, `meta description` e `theme-color` no `index.html`.
- Sem biblioteca pesada: voz e ditado usam APIs do navegador.
- Imagens são SVG leves (Casinha e favicon).
- Cores com contraste conferido (`docs/contraste-cores.md`).

## Meta
Acessibilidade acima de 90. Se uma nota ficar abaixo, abra o item reprovado no relatório e corrija antes da entrega.
