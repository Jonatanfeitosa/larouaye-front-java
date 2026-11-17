# Arquitetura do LarOuAyê (proposta para decisão do grupo)

> Regra de ouro: **a IA identifica, o Java decide, o conteúdo jurídico fundamenta.**
> O front é a porta de entrada; a robustez está no back-end.

## 1. Visão geral

```
 Web (React)  ─┐                                   ┌─> Flask (Python): 2 modelos de ML
               ├─> JAVA Spring Boot (única ponte) ─┤
 Telegram bot ─┘     • valida e protege as APIs    └─> Oracle (SQL Developer): usuários,
                     • regras de negócio                 conversas, consultas, orientações,
                     • escolhe a orientação              etapas, progresso
```

| Camada | Responsabilidade | Nunca faz |
|---|---|---|
| React | Interface acessível, voz, avatar, chamadas `fetch` ao Java | Falar com Oracle/Flask; guardar texto jurídico |
| Java | Autenticação por sessão, validação, regras, catálogo jurídico, histórico, CORS, limite de requisições | Confiar só na confiança do classificador |
| Flask | Classificar intenção e etapa (2 modelos) | Responder ao usuário, acessar banco |
| Oracle | Persistir tudo (JDBC, sem JPA) | Regra de negócio |
| Telegram | Segundo canal de entrada | Falar direto com Flask/Oracle |

## 2. Fluxo de uma pergunta (igual na web e no Telegram)
1. Canal envia `POST /api/conversas/{id}/mensagens` ao Java (texto, UF, etapa; no Telegram, o bot repassa).
2. Java valida, grava a mensagem no Oracle e chama `POST /classificar` no Flask.
3. Política de confiança: **≥ 0,85** responde; **0,60 a 0,84** pede esclarecimento com opções; **< 0,60** oferece menu manual e encaminhamento.
4. Java busca no catálogo a orientação (com base legal e data de revisão) e grava a resposta.
5. Se o Flask cair, o Java segue pelo menu por categoria (nunca fica sem resposta).

## 3. Telegram e personagem (DECIDIDO pelo grupo em 12/11/2026)
- **Telegram entra no MVP**, como segundo canal. **Só agentes automáticos** (sem pessoas reais respondendo).
- A rota **continua** `POST /api/usuarios/{id}/consultas` (a rota aninhada 1:N que a disciplina de Java exige). Nada muda para o front web.
- O Java continua sendo a **única ponte**: o bot do Telegram fala com o Java, nunca com o Flask nem com o Oracle.
- O app (com a Casinha) e o Telegram são dois canais do mesmo atendimento, com o mesmo histórico no Oracle.

O que o Telegram acrescenta no back-end (o front web não muda):
1. **Oracle:** `tb_usuario` ganha `ds_canal` (`WEB` ou `TELEGRAM`) e `cd_id_externo` (o `chat_id`), com UNIQUE em (canal, id externo).
2. **Java:** `POST /api/telegram/webhook` recebe a mensagem do bot, acha ou cria o usuário pelo `chat_id` e segue o fluxo da consulta (seção 2). A resposta volta ao Telegram pelo método `sendMessage` da Bot API.
3. **Segurança do webhook:** o Telegram envia o cabeçalho `X-Telegram-Bot-Api-Secret-Token`; o Java rejeita (401) quem não enviar o valor certo. O token do bot fica em variável de ambiente, nunca no repositório.
4. **Texto curto para o Telegram:** a resposta vai em linguagem simples, com a fonte e o link, e botões de resposta rápida para o esclarecimento.

Por que o app **não** fala com o Telegram por baixo dos panos: exige que a pessoa tenha Telegram, mensagens de bots não são criptografadas ponta a ponta e a FIAP exige o front consumindo a **API Java**.

## 4. Qual motor de conversa usar
| Opção | Prós | Contras |
|---|---|---|
| **Telegram Bot API** (canal) | Gratuito, simples, webhook | Só canal, não é "inteligência" |
| **Modelos próprios (Flask) + catálogo no Java** (recomendado) | Cumpre o edital (2 modelos), respostas auditáveis, sem custo por uso | Cobertura limitada ao catálogo |
| IBM Watson Assistant | Bom para fluxos | Plano gratuito de estudante tem limites (conferir a cota vigente na sua conta) |
| Rasa (código aberto) | Controle total, roda em Docker | Exige hospedagem e manutenção |
| LLM generativo com busca restrita ao catálogo | Linguagem natural fluida | Risco de resposta jurídica inventada; custo; **não substitui** os 2 modelos exigidos |

Recomendação: **Flask + catálogo + Telegram como canal**; se quiserem fluidez, um LLM apenas para **reescrever em linguagem simples** o texto já aprovado do catálogo (nunca para criar o conteúdo), e sempre mostrando a fonte.

## 5. Back-end robusto (item 5)
- **Java (Spring Boot, JDBC, DAO por entidade):** DTOs, Bean Validation, `@RestControllerAdvice` (erros em JSON sem stack trace), CORS apenas para a origem da Vercel, limite de requisições por IP, token de sessão anônimo (sem CPF), segredos em variáveis de ambiente, HTTPS.
- **Oracle:** `tb_usuario`, `tb_conversa`, `tb_mensagem`, `tb_consulta`, `tb_categoria`, `tb_orientacao`, `tb_etapa`, `tb_usuario_etapa` (N:N), `tb_servico`, `tb_fonte_oficial`. Conversas e jornada guardadas por usuário, com data.
- **Python/Flask:** classificação de intenção e de etapa/encaminhamento, métricas e `joblib`; **validações de regra de negócio** (ex.: parcela até 30% da renda) ficam no Java, consultando o Flask só para classificar.
- **LGPD:** aviso de privacidade, dado mínimo, exclusão sob pedido, sem dados sensíveis.

## 6. Inclusão (item 4) — o que o front já cobre e o que falta
Já: voz para ouvir (página e respostas), ditado da pergunta, Casinha falante, leitura fácil, alto contraste, letra ajustável, teclado, leitor de tela, perguntas prontas com ícones.
Falta: modo 100% guiado por ícones e áudio (sem digitar), vídeos com legenda e Libras (VLibras do gov.br), testes com pessoas reais, e voz mais natural (síntese do servidor, em vez da voz do navegador).

## 7. Decisões
| Tema | Decisão |
|---|---|
| Telegram | No MVP, como canal |
| Quem responde | Só agentes automáticos |
| Rota da consulta | Mantida: `POST /api/usuarios/{id}/consultas` |

## 8. Ainda em aberto (precisa de resposta do back-end)
1. Prefixo `/api` e a rota `GET /api/saude` (pode ser o Actuator).
2. Formato da resposta da consulta (ver `CONTRATO-API.md`).
3. Quem cria e hospeda o bot do Telegram (sugestão: Java, via webhook, no mesmo serviço do Render).
