# PRD — Elas Recebem Hoje

## Objetivo

Demonstrar que um pagamento legítimo devido a uma pessoa no Brasil por um pagador no exterior pode, depois de confirmado e validado, originar uma pool financiada por aportes Lightning, com duas formas de exposição cambial, reputação portátil e regras explícitas de distribuição.

## Personas

1. **Solicitante no Brasil com pagador internacional:** tem salário, venda, comissão, serviço ou outro pagamento comprovável a receber e deseja antecipar até 95% do valor nominal.
2. **Aportadora:** aceita risco após consultar evidências resumidas, modalidade, prazo, reputação e proteção disponível.
3. **Pagador no exterior:** confirma a obrigação, aceita quitá-la em BTC e paga por link Lightning no vencimento.
4. **Operação administrativa:** trata exceções da validação automática e incidentes; não constitui papel público de verificadora.

## Histórias principais

- Como solicitante, quero saber meu limite antes de cadastrar um recebível.
- Como solicitante, quero aumentar meu limite conectando evidências de identidade, presença digital, histórico e garantia.
- Como solicitante, quero cadastrar e acompanhar um recebível sem expor documentos às aportadoras ou ao Nostr.
- Como pagador, quero confirmar os dados sem criar conta completa.
- Como aportadora, quero comparar Full BTC e pareada em dólar antes de aportar.
- Como aportadora, quero ver exatamente quem assume volatilidade, inadimplência e custos.
- Como plataforma, quero impedir recebíveis duplicados e pagadores reincidentes.
- Como participante, quero entrar assinando um desafio na carteira Lightning e consultar atestados não sensíveis sem publicar minha carteira.

## Requisitos funcionais

### Conta, identidade e limite

- RF-01: criar conta sem exigir gênero.
- RF-01A: criar e acessar a conta por LNURL-auth, sem exigir e-mail, telefone, endereço de pagamento, saldo ou frase-semente.
- RF-01B: manter a reputação no ID interno opaco e permitir, em evolução posterior, mais de uma carteira autenticadora por conta sem multiplicar reputação.
- RF-02: atribuir limite inicial equivalente a US$ 100.
- RF-03: permitir conexão de identidade Nostr e redes sociais por consentimento.
- RF-04: registrar evidências verificadas, fonte, data, expiração e impacto no limite.
- RF-05: aceitar garantia e simular inicialmente a regra de US$ 500 liberando até US$ 1.000 de limite total.
- RF-06: explicar cada aumento ou redução do limite.

### Recebível e validação

- RF-07: cadastrar país do pagador, moeda estrangeira de referência, valor nominal, vencimento e evidências.
- RF-08: gerar link único, expirável e de uso controlado para confirmação e aceite de pagamento em BTC.
- RF-09: comparar confirmação do pagador com a solicitação e registrar o aceite explícito da liquidação em BTC.
- RF-09A: tornar o recebível inelegível se o pagador recusar pagamento em BTC; não criar pool.
- RF-10: verificar identidade, integridade, duplicidade, histórico da solicitante e histórico de pagamento do pagador.
- RF-10A: registrar a origem do pagamento como `SALARY`, `SALE`, `COMMISSION`, `SERVICE` ou `OTHER`, com descrição e evidência compatíveis.
- RF-11: aprovar, recusar ou solicitar correções automaticamente; permitir revisão administrativa excepcional auditada.

### Pool e aportes

- RF-12: calcular meta da pool a partir do valor nominal e desconto de até 5%.
- RF-13: criar uma pool Full BTC ou pareada em dólar, nunca ambas para o mesmo recebível ativo.
- RF-14: exibir modalidade, meta, prazo, progresso, custos, retorno estimado e riscos.
- RF-15: criar invoice Lightning única por intenção de aporte e reconhecer liquidação idempotentemente.
- RF-16: aceitar múltiplos aportes até a meta, impedindo sobre-financiamento.
- RF-17: se o prazo terminar parcialmente financiado, permitir à solicitante aceitar o parcial ou devolver todos os aportes.

### Liquidação

- RF-18: liberar a antecipação somente após as condições de fechamento.
- RF-18A: desembolsar a antecipação da solicitante exclusivamente em BTC via Lightning, independentemente da modalidade da pool.
- RF-18B: cobrar taxas de rede, conversão e spread da solicitante, exibindo antecipação bruta, custos e desembolso líquido; esses custos não reduzem principal ou resultado da pool.
- RF-19: gerar invoice Lightning de pagamento ao pagador no vencimento, fixando a quantidade de sats pela cotação e validade exibidas.
- RF-20: distribuir principal e resultado líquido proporcionalmente.
- RF-21: destinar 30% do resultado líquido à plataforma e 70% às aportadoras.
- RF-22: acionar a cobertura limitada da plataforma na inadimplência e registrar recuperação.
- RF-22A: apresentar separadamente valor contratual de referência, cotação, spread, tarifa Lightning, custo de swap e valor líquido; a plataforma recebe apenas BTC.

### Nostr e auditoria

- RF-23: publicar atestados por signer institucional externo sem solicitar `nsec` da participante.
- RF-24: publicar somente IDs opacos, hashes, tipos de atestado e status não sensíveis.
- RF-25: manter trilha interna imutável de decisões, cotações e movimentos.

## Requisitos não funcionais

- RNF-01: operações monetárias idempotentes e conciliáveis.
- RNF-02: valores em inteiros (`msat`, centavos ou unidade mínima do ativo).
- RNF-03: criptografia em trânsito e repouso para documentos.
- RNF-04: acesso mínimo por função, MFA administrativo e dupla aprovação para saídas.
- RNF-05: nenhuma chave privada em frontend, repositório ou logs.
- RNF-06: modo demonstração visualmente distinto do modo mainnet.
- RNF-07: recuperação de falhas de webhook, relay, cotação e pagamento.
- RNF-08: acessibilidade básica, português e arquitetura preparada para espanhol.
- RNF-09: desafios LNURL-auth expiráveis, de uso único e vinculados a host HTTPS estável; sessões revogáveis em cookie `HttpOnly`.

## Regras financeiras

- `antecipacao = valor_nominal - desconto`.
- `desconto_percentual <= 5%` e varia por prazo e risco.
- `resultado_liquido = valor_recebido - principal - custos_e_perdas_aplicaveis`.
- Se `resultado_liquido > 0`, plataforma recebe 30% e aportadoras 70% proporcionalmente.
- Nenhuma distribuição pode consumir o principal de outra pool.
- Cotações têm provedor, par, instante, validade e política de arredondamento.

## Critérios de sucesso do hackathon

- Fluxo narrável em 3–5 minutos.
- Uma invoice Lightning mainnet de pequeno valor paga e conciliada.
- Modalidades comparáveis com números compreensíveis.
- Limite inicial e aumento explicável.
- Nenhum documento ou dado pessoal em Nostr.
- Falha externa não impede a conclusão da demo em modo controlado.

## Critérios de aceite do fluxo principal

1. Uma conta com limite suficiente cadastra recebível.
2. Pagador confirma origem, descrição, valor, vencimento e aceite de BTC por link válido.
3. Pagador aceita explicitamente pagar em BTC; recusa encerra a solicitação sem pool.
4. Plataforma aprova e cria exatamente uma pool.
5. Aporte real de baixo valor altera o progresso uma única vez.
6. Encerramento parcial oferece aceitar ou reembolsar.
7. Liquidação demonstra a divisão 30/70 após custos.
8. Eventos de reputação não revelam dados reconstruíveis.

## Fora do escopo do MVP

- Operação pública irrestrita com valores relevantes.
- Cobertura ilimitada de inadimplência.
- Originação por solicitantes fora do Brasil no primeiro MVP.
- Promessa de que a rota cambial será sempre mais barata que bancos ou plataformas concorrentes.
- Recebimento, custódia ou conversão de USD, BRL ou outra moeda fiat pela plataforma.
- Motor de crédito por IA.
- Mercado secundário de participações.
- Custódia não unilateral completa e autônoma.
- Garantia de retorno ou de paridade de qualquer ativo.

## Limitações

USDt na Liquid via Breez SDK Liquid é a única stablecoin do MVP. Liquidez de swaps, recuperação da carteira, taxas, limites e conciliação precisam ser comprovados antes da mainnet controlada. Custódia, crédito, garantia e intermediação financeira exigem avaliação jurídica e operacional antes de produção.
