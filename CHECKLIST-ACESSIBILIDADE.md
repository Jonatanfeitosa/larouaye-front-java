# Checklist de Acessibilidade — LarOuAyê

**Projeto:** Global Solution FIAP 2026/2 — CitizenTech  
**Responsável pela documentação:** Jonatan Feitosa  
**Objetivo:** verificar a acessibilidade e a usabilidade da plataforma para cidadãos que buscam orientações sobre a compra do primeiro imóvel.

## 1. Objetivo e critérios

A avaliação considera as recomendações WCAG 2.2, especialmente o nível AA, como referência de boas práticas.

A existência de funcionalidades acessíveis não representa, por si só, conformidade integral com as WCAG.

Legenda:
- [x] Verificado por teste automatizado ou inspeção de código.
- [ ] Pendente de verificação manual ou integração.

## 2. Estrutura e navegação

- [ ] Confirmar a existência de uma estrutura semântica adequada: `header`, `nav`, `main` e `footer`.
- [ ] Verificar hierarquia lógica dos títulos (`h1`, `h2`, `h3`).
- [ ] Validar o funcionamento do link "Pular para o conteúdo".
- [ ] Confirmar que todos os recursos podem ser utilizados somente com teclado.
- [ ] Verificar a ordem de foco ao navegar com Tab.
- [ ] Confirmar a visibilidade do foco em botões, links e formulários.
- [ ] Verificar se o foco é administrado corretamente ao trocar de rota.
- [ ] Confirmar a ausência de armadilhas de teclado.

## 3. Tamanho da fonte

- [x] Verificado o funcionamento dos controles de aumento e diminuição da fonte por testes automatizados.
- [x] Confirmados os limites de tamanho `normal`, `grande` e `maior`.
- [x] Verificada a persistência do tamanho escolhido no `localStorage`.
- [x] Verificado o tratamento de valores inválidos armazenados.
- [ ] Confirmar visualmente que o aumento da fonte não provoca sobreposição ou perda de conteúdo.
- [ ] Testar zoom de 200% e 400% no navegador.

## 4. Leitura fácil

- [x] Testada a ativação e desativação do modo de leitura fácil.
- [x] Verificada a atualização do atributo `data-leitura`.
- [x] Confirmada a persistência da preferência no `localStorage`.
- [ ] Verificar visualmente os espaçamentos entre linhas, palavras e parágrafos.
- [ ] Avaliar a clareza das instruções e a linguagem utilizada nas páginas.

## 5. Alto contraste e cores

- [x] Testada a ativação e desativação do alto contraste.
- [x] Verificada a atualização do atributo `data-contraste`.
- [x] Confirmada a persistência da preferência no `localStorage`.
- [ ] Medir o contraste de textos e elementos de interface em todas as páginas.
- [ ] Confirmar contraste mínimo de 4,5:1 para textos comuns e 3:1 para textos grandes, quando aplicável.
- [ ] Confirmar que mensagens de erro e estados não dependem exclusivamente de cores.
- [ ] Verificar o contraste dos indicadores de foco e dos componentes interativos.

## 6. Leitura em voz alta

- [x] Testada a identificação de suporte à síntese de voz.
- [x] Verificada a configuração do idioma `pt-BR`.
- [x] Verificada a velocidade de reprodução configurada.
- [x] Testado o tratamento de textos vazios.
- [x] Testada a interrupção da reprodução.
- [x] Testados os eventos de término e erro de leitura.
- [x] Testada a interrupção ao desmontar o componente.
- [ ] Testar a reprodução real em navegadores compatíveis.
- [ ] Confirmar se o conteúdo lido corresponde ao texto principal da página.
- [ ] Verificar o funcionamento com tecnologias assistivas, como NVDA ou VoiceOver.

## 7. Formulários e mensagens

- [ ] Confirmar que todos os campos possuem rótulos acessíveis.
- [ ] Verificar a identificação e a explicação dos erros de validação.
- [ ] Confirmar que os erros podem ser identificados sem depender de cor.
- [ ] Testar as mensagens dinâmicas com leitores de tela.
- [ ] Verificar o uso adequado de `aria-live`, `role="status"` e `role="alert"`.
- [ ] Confirmar o comportamento dos formulários durante carregamento e envio.

## 8. Página Minha Jornada

- [x] Testada a solicitação de identificação quando não há usuário.
- [x] Testado o estado de carregamento.
- [x] Verificada a ordenação das etapas.
- [x] Testada a exibição do progresso recuperado da API simulada.
- [x] Testada a apresentação do estado vazio.
- [x] Testado o tratamento de erros de carregamento.
- [x] Testado o salvamento do progresso usando API simulada.
- [x] Testado o tratamento de falha no salvamento.
- [ ] Testar a página com teclado e leitor de tela.
- [ ] Validar a integração com o back-end Java real.

## 9. Responsividade e movimento

- [ ] Inspecionar a interface nas larguras de 320 px, 390 px, 768 px e 1440 px.
- [ ] Confirmar que não há rolagem horizontal desnecessária.
- [ ] Verificar que botões e links têm áreas de acionamento adequadas.
- [ ] Testar o modo `prefers-reduced-motion`.
- [ ] Verificar o comportamento da interface na orientação retrato e paisagem.

## 10. Validação antes da entrega

Executar:

```bash
npx vitest run
npm run build
npm run lint
```

Registrar os resultados efetivamente obtidos e corrigir eventuais falhas antes da entrega.

## 11. Evidências e pendências

**Evidências automatizadas disponíveis:**

- `src/components/BarraAcessibilidade.test.tsx`
- `src/contexts/AcessibilidadeContext.test.tsx`
- `src/hooks/useLeituraEmVoz.test.ts`
- `src/pages/Jornada.test.tsx`
- `src/components/StatusServidor.test.tsx`

**Pendências principais:**

- Realizar testes manuais com teclado.
- Realizar avaliação com leitor de tela.
- Medir o contraste das cores.
- Conferir responsividade e zoom.
- Confirmar o funcionamento da API Java em ambiente integrado.

## 12. Conclusão

O LarOuAyê possui recursos de acessibilidade implementados e cobertos por testes automatizados, incluindo ajuste de fonte, leitura fácil, alto contraste e leitura em voz alta.

A validação completa de acessibilidade ainda depende dos testes manuais e da conferência das páginas no ambiente integrado. Portanto, este checklist registra o estágio da verificação, sem declarar conformidade integral com as WCAG 2.2.