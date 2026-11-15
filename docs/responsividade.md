# Checklist de responsividade

A FIAP avalia **três tamanhos de tela**. O projeto é mobile-first (Tailwind): o estilo base é o celular, e `md:` e `lg:` ampliam.

| Tamanho | Aparelho | Como testar no Chrome |
|---|---|---|
| 390 x 844 | celular | F12, ícone de celular, Dimensions: Responsive, digite 390 x 844 |
| 768 x 1024 | tablet | mesma tela, 768 x 1024 |
| 1440 x 900 | computador | mesma tela, 1440 x 900 |

## Para cada página, em cada tamanho
- [ ] Sem **rolagem horizontal**.
- [ ] Texto legível sem zoom, botões com pelo menos 44 px de altura.
- [ ] Menu: no celular abre pelo botão **Abrir menu**; no computador aparece inteiro.
- [ ] Formulários: campos ocupam a largura toda, erros aparecem abaixo do campo.
- [ ] Imagens e a Casinha não ficam cortadas nem minúsculas.

## Páginas
Início, Assistente, Jornada, Dúvidas, Sobre, Integrantes, Detalhe do integrante, Contato e 404.

## Dica
Com a letra no tamanho **A+** e **Leitura fácil** ligada, repita o teste de 390 px: é o caso mais apertado.
