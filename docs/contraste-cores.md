# Contraste das cores do LarOuAyê

Valores calculados com a fórmula de luminância relativa do WCAG 2.1. O mínimo para texto comum é **4,5:1** (nível AA); para texto grande, 3:1.

| Uso | Par de cores | Razão | Resultado |
|---|---|---|---|
| Texto padrão sobre cartões | azul `#102b35` sobre branco `#ffffff` | 14.80:1 | AAA |
| Texto padrão sobre o fundo da página | azul `#102b35` sobre cinza `#f2f4f3` | 13.40:1 | AAA |
| Botão destaque e título no cabeçalho (texto ouro sobre azul) | ouro `#d8b875` sobre azul `#102b35` | 7.78:1 | AAA |
| Texto branco sobre azul (menu, botão primário) | branco `#ffffff` sobre azul `#102b35` | 14.80:1 | AAA |
| Mensagens de erro sobre cartão branco | erro `#9b1c1c` sobre branco `#ffffff` | 8.15:1 | AAA |
| Mensagem de sucesso sobre cartão branco | ok `#166534` sobre branco `#ffffff` | 7.13:1 | AAA |
| Barra de acessibilidade (texto branco sobre grafite) | branco `#ffffff` sobre grafite `#263238` | 13.16:1 | AAA |
| NÃO USAR: texto ouro sobre branco | ouro `#d8b875` sobre branco `#ffffff` | 1.90:1 | REPROVA |
| NÃO USAR: texto ouro sobre cinza | ouro `#d8b875` sobre cinza `#f2f4f3` | 1.72:1 | REPROVA |

## Regras que saem daqui
- Texto **ouro** só sobre fundo **azul**. Nunca sobre branco ou cinza.
- Mensagens de erro (`erro`) e de sucesso (`ok`) só sobre fundo **branco**.
- Nunca use cor como única informação: o erro tem texto e o campo tem `aria-invalid`, o botão ativo tem `aria-pressed`.
- O modo **Alto contraste** (barra de acessibilidade) troca para preto sobre branco.

## Como recalcular
Troque as cores em `src/index.css` (bloco `@theme`) e refaça a conta com qualquer verificador de contraste WCAG antes de entregar.
