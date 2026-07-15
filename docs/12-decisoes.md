# Registro de decisões

## ADR-001 — público aberto com foco em mulheres

- **Data:** 2026-07-14
- **Status:** confirmada
- **Contexto:** produto nasce para mulheres no Brasil que recebem pagamentos do exterior, sem exclusividade obrigatória.
- **Alternativas:** exclusivo; prioridade formal; aberto com posicionamento focado.
- **Decisão:** aberto a todos, com marca e comunidade focadas em mulheres.
- **Consequências:** não verificar gênero; medir impacto com consentimento e dados agregados.

## ADR-002 — validação pela plataforma

- **Data:** 2026-07-14
- **Status:** confirmada
- **Alternativas:** verificadora comunitária; aportadora; plataforma.
- **Decisão:** plataforma automática com revisão administrativa excepcional.
- **Consequências:** regras versionadas, explicabilidade e auditoria; aportadora não valida.

## ADR-003 — desconto variável até 5%

- **Data:** 2026-07-14
- **Status:** confirmada
- **Decisão:** preço varia por prazo/risco, limitado inicialmente a 5%.
- **Consequências:** fórmula precisa ser transparente e não pode prometer competitividade universal.

## ADR-004 — resultado 30/70

- **Data:** 2026-07-14
- **Status:** confirmada
- **Decisão:** depois de custos, 30% do resultado líquido para plataforma e 70% para aportadoras.
- **Consequências:** principal é intocável; perdas e resultado não positivo precisam de regra explícita.

## ADR-005 — pool parcial

- **Data:** 2026-07-14
- **Status:** confirmada
- **Decisão:** solicitante pode aceitar antecipação parcial; se recusar, aportes são devolvidos.
- **Consequências:** novo aceite informado e custo de reembolso transparente.

## ADR-006 — duas modalidades

- **Data:** 2026-07-14
- **Status:** confirmada
- **Decisão:** Full BTC com risco cambial da aportadora; pool USD com conversão imediata a USDT.
- **Consequências:** UI e ledger separam exposição; Full BTC não garante os mesmos sats.

## ADR-007 — USDT no ecossistema Bitcoin

- **Data:** 2026-07-14
- **Status:** substituída pela ADR-026
- **Decisão anterior:** avaliar USDT via Taproot Assets/Lightning.
- **Consequências:** não será implementada no MVP; preservada apenas como histórico da decisão.

## ADR-008 — custódia

- **Data:** 2026-07-14
- **Status:** assumida para o MVP
- **Alternativas:** carteira da plataforma; escrow/multisig.
- **Decisão:** custódia própria extremamente limitada no MVP; escrow como arquitetura futura.
- **Consequências:** segurança, reserva, reconciliação e avaliação jurídica são bloqueadores de produção.

## ADR-009 — pagamento Lightning

- **Data:** 2026-07-14
- **Status:** confirmada
- **Decisão:** aportes e pagamento do pagador usam BTC via Lightning.
- **Consequências:** pagador precisa de carteira/liquidez; invoice e cotação têm validade.

## ADR-010 — cobertura de inadimplência

- **Data:** 2026-07-14
- **Status:** confirmada com limites pendentes
- **Decisão:** plataforma cobre aportadoras e recupera da parte responsável.
- **Consequências:** reserva segregada, tetos e termos; não pode ser ilimitada.

## ADR-011 — limite progressivo

- **Data:** 2026-07-14
- **Status:** regra demonstrativa confirmada
- **Decisão:** US$ 100 base; identidade, redes sociais consentidas, histórico e garantia aumentam limite. Exemplo: US$ 500 em garantia pode liberar até US$ 1.000.
- **Consequências:** regras explicáveis, expiração e proteção contra fraude. A fórmula v0.1 está em `docs/14-guardrails-operacionais.md`; calibração e haircut para operação real permanecem futuros.

## ADR-012 — Nostr sem chave privada

- **Data:** 2026-07-14
- **Status:** confirmada
- **Decisão:** NIP-98 assinado por NIP-07 para login; NIP-46 atrás de adapter alternativo; atestados `kind 30078` mínimos, sem PII, contratos ou valores. NIP-85 foi descartado no MVP porque o draft atual não modela os fatos operacionais necessários.
- **Consequências:** assinatura não prova verdade; desafio é efêmero e de uso único; correção é append-only; relays não participam da autorização financeira.

## ADR-013 — recorte geográfico e cambial

- **Data:** 2026-07-14
- **Status:** confirmada
- **Decisão:** primeiro público composto por pessoas no Brasil com pagamentos devidos por pagadores no exterior, com foco de produto e comunidade em mulheres; expansão posterior para outras origens na LATAM.
- **Consequências:** preservar moeda original, exibir câmbio e tarifas, avaliar Brasil e país do pagador e não alegar operação regional simultânea.

## ADR-014 — dinheiro real no pitch

- **Data:** 2026-07-14
- **Status:** confirmada
- **Decisão:** um aporte Lightning real e pequeno; restante controlado quando não seguro/autorizado.
- **Consequências:** modo demo explícito, allowlist, teto e plano alternativo.

## ADR-015 — transparência cambial

- **Data:** 2026-07-14
- **Status:** confirmada em princípio
- **Decisão:** a plataforma facilita a compreensão da equivalência entre a moeda estrangeira contratual, BTC/USDT e referência em BRL, exibindo cotação, spread, tarifas e líquido separadamente.
- **Consequências:** a plataforma não executa conversão fiat, não recebe USD/BRL e não promete menor custo sem comparação verificável.

## ADR-016 — desembolso exclusivo em BTC

- **Data:** 2026-07-14
- **Status:** confirmada
- **Decisão:** a solicitante recebe a antecipação exclusivamente em BTC via Lightning, inclusive na modalidade pareada em dólar.
- **Consequências:** a pool pareada mantém obrigação/hedge em USDT e exige liquidez BTC separada da tesouraria; BRL e USDT não são opções de saque da solicitante.

## ADR-017 — stack do MVP

- **Data:** 2026-07-14
- **Status:** aprovada para implementação
- **Decisão:** Next.js/TypeScript, pnpm, PostgreSQL, Drizzle, Vitest, Testing Library e Playwright; integrações externas atrás de adapters.
- **Consequências:** monólito modular na primeira versão; versões exatas serão fixadas na Etapa 1 usando releases estáveis/LTS.

## ADR-018 — limites mainnet da demo

- **Data:** 2026-07-14
- **Status:** aprovada para implementação
- **Decisão:** 1.000 sats por aporte, 5.000 sats recebidos por sessão e 10.000 sats na carteira quente; uma invoice ativa; saídas automáticas desabilitadas antes da Etapa 9.
- **Consequências:** qualquer aumento exige decisão e novo tabletop; produção continua desabilitada.

## ADR-019 — reserva e cobertura

- **Data:** 2026-07-14
- **Status:** aprovada para implementação demonstrativa
- **Decisão:** capital próprio segregado e mínimo de 110% do payout máximo coberto; antes da Etapa 9 a cobertura é apenas demonstrada com valores fictícios.
- **Consequências:** principal de pools e receita futura não contam como reserva; cobertura não inclui volatilidade da Full BTC.

## ADR-020 — política cambial v0.1

- **Data:** 2026-07-14
- **Status:** aprovada para implementação demonstrativa
- **Decisão:** USD/BTC inicial, BRL informativo, spread da plataforma zero, custos externos separados, cotação por 60 segundos e novo aceite acima de 1% de desvio.
- **Consequências:** produção exige fonte redundante e análise cambial; payout continua somente em BTC.

## ADR-021 — fórmulas demonstrativas v0.1

- **Data:** 2026-07-14
- **Status:** aprovada para implementação demonstrativa
- **Decisão:** desconto por faixas de prazo com ajuste de risco e teto de 5%; limite explicável com base de US$ 100, sinais verificados, histórico e garantia de 2x não aditiva.
- **Consequências:** fórmulas não são modelos calibrados de crédito; detalhes estão em `docs/14-guardrails-operacionais.md`.

## ADR-022 — aceite e liquidação do pagador somente em BTC

- **Data:** 2026-07-14
- **Status:** confirmada
- **Decisão:** o link de confirmação pergunta se o pagador aceita pagar em BTC. Sem aceite, o recebível é inelegível e nenhuma pool é criada. Com aceite, o pagador recebe invoice Lightning no vencimento e a plataforma recebe somente BTC.
- **Consequências:** USD/BRL são referências contratuais; aquisição e conversão para BTC acontecem fora da plataforma e são responsabilidade do pagador.

## ADR-023 — PostgreSQL, ledger assinado e invariantes no banco

- **Data:** 2026-07-14
- **Status:** implementada na Etapa 2
- **Decisão:** valores financeiros usam inteiros; cada partida do ledger tem valor assinado e a soma precisa fechar em zero para cada ativo dentro da transação. Idempotência, pool ativa única, limites de financiamento, correspondência entre conta e ativo e transições de estado também são protegidos por constraints, índices ou triggers PostgreSQL.
- **Consequências:** BTC, USDT e USD de referência nunca se compensam entre si; partidas publicadas são imutáveis e correções futuras exigem evento compensatório. Os testes aplicam todas as migrations em PostgreSQL embarcado, enquanto execução normal usa PostgreSQL via `DATABASE_URL`.

## ADR-024 — limite explicável, consentido e tolerante à expiração

- **Data:** 2026-07-14
- **Status:** implementada na Etapa 3
- **Decisão:** o limite v0.1 usa US$ 100 base, identidade consentida, até duas contas profissionais verificadas, histórico interno de operações quitadas e garantia exclusivamente simulada. Seguidores, gênero e conteúdo social não entram no cálculo. O total é o maior entre o componente sem garantia, limitado a US$ 1.000, e duas vezes a garantia elegível; os componentes não são somados.
- **Consequências:** evidência expirada, revogada ou sem consentimento deixa de contar. Se o limite recalculado ficar abaixo do valor já utilizado, a obrigação existente permanece registrada, o disponível vira zero e novos usos são bloqueados. Toda alteração gera evento append-only com regra, composição, motivo, correlação e chave idempotente.

## ADR-025 — confirmação por bearer token e validação exclusiva da plataforma

- **Data:** 2026-07-14
- **Status:** implementada na Etapa 4
- **Decisão:** o pagador recebe um token aleatório de 256 bits no fragmento do link. O navegador remove o fragmento da barra e envia o token apenas no corpo de requisições `POST`; o banco armazena somente SHA-256, expiração e estado de uso. A resposta confirma origem e descrição do pagamento, valor, vencimento e aceite de BTC. Regras determinísticas versionadas da plataforma avaliam identidade consentida, evidência, correspondência, duplicidade, histórico, limite, país e moeda. A aportadora apenas consulta pools posteriormente e não valida recebíveis.
- **Consequências:** recusa de BTC rejeita o recebível; divergência preserva a versão anterior e exige novo link; aprovação reivindica o fingerprint e reserva o limite na mesma transação. Histórico de inadimplência exige revisão administrativa excepcional e auditada. Não existe endpoint administrativo ou cadastro público antes de autenticação apropriada. Rate limiting distribuído, armazenamento S3 privado, antimalware real e envio do link dependem da infraestrutura futura.

## ADR-026 — USDt exclusivo na Liquid via Breez SDK

- **Data:** 2026-07-14
- **Status:** confirmada; implementação pendente nas Etapas 5, 6 e 8
- **Decisão:** a única stablecoin da pool pareada será o Tether USDt emitido na Liquid. A integração usará Breez SDK Liquid atrás de adapter próprio. Aportes e pagamentos continuam em BTC via Lightning; swaps explícitos convertem entre Lightning, L-BTC e USDt. USDC e USDT via Taproot Assets ficam fora do MVP.
- **Consequências:** Liquid é uma sidechain da Bitcoin, não a blockchain principal. O asset ID precisa ser allowlisted por rede. Seed, signer, API key e estado persistente são segredos operacionais. Se a plataforma controlar a chave, a operação é tratada como custodial. Mainnet permanece deny-by-default, limitada por feature flag e somente pode ser habilitada após testnet, backup/restore, liquidez, slippage, conciliação, responsável humano e avaliação jurídica.

## ADR-027 — regras financeiras e capacidade das pools v0.1

- **Data:** 2026-07-14
- **Status:** implementada na Etapa 5
- **Decisão:** o desconto usa faixas de prazo de 2% a 5% mais ajuste de risco, sempre limitado a 5%. A antecipação em centavos é arredondada para baixo e a meta em sats para cima. Perdas atribuíveis à pool podem reduzir o resultado; taxas, spread e custos de recebimento não podem. Esses custos são cobrados separadamente da solicitante e reduzem apenas seu desembolso líquido. Do resultado da pool, 30% são destinados à plataforma por arredondamento para baixo e todo resíduo fica nos 70% das aportadoras. A divisão proporcional usa maior resto, com desempate por ID opaco. Intenções reservam capacidade no PostgreSQL antes da emissão de invoice. Pool parcial recebe exatamente uma decisão append-only: aceitar ou reembolsar.
- **Consequências:** soma de principal e resultado é preservada em inteiros, invoices concorrentes não podem ultrapassar a meta e retries com parâmetros divergentes falham. A modalidade USD_PAIRED exige obrigação em unidades USDt e reserva BTC de tesouraria ao menos igual à meta em sats, sem tratar os dois ativos como o mesmo saldo. Todos os registros da Etapa 5 usam ambiente `SIMULATION`; nenhuma cotação, invoice, swap ou distribuição externa foi habilitada.

## ADR-028 — origens amplas de pagamento internacional

- **Data:** 2026-07-14
- **Status:** implementada como correção transversal antes da Etapa 6
- **Decisão:** freelancer não é condição de elegibilidade. O recebível registra uma origem entre salário, venda, comissão, serviço e outro pagamento legítimo, além de descrição e evidência. O pagador confirma esses dados; a validação continua sendo responsabilidade exclusiva da plataforma.
- **Consequências:** telas, testes e documentação usam “solicitante” e “pagador”. Freelance permanece apenas como exemplo. A mudança não habilita Breez, testnet, mainnet, USDt real nem movimentação financeira.

## ADR-029 — Breez Liquid diretamente em mainnet, deny-by-default

- **Data:** 2026-07-14
- **Status:** autorizada para implementação; ativação financeira pendente
- **Contexto:** a fundadora substituiu expressamente a passagem obrigatória por testnet e solicitou integração direta em mainnet.
- **Decisão:** usar `@breeztech/breez-sdk-liquid` fixado em `0.12.4`, rede `mainnet`, L-BTC e Tether USDt em allowlist oficial. O gateway permanece desligado sem `BREEZ_ENABLE_MAINNET=true`, API key, mnemonic e diretório persistente. Cada invoice é limitada a 1.000 sats, uma sessão a 5.000 sats e a carteira quente a 10.000 sats. Resultado externo incerto bloqueia retry automático e exige conciliação.
- **Consequências:** a decisão substitui apenas o requisito “testnet primeiro” da ADR-026. Não autoriza depósito de segredos no Git, abertura pública, aumento de teto ou movimentação durante testes automatizados. O pacote e o adapter mainnet podem ser validados sem conectar a carteira; o aceite operacional permanece pendente até uma invoice mainnet controlada ser paga e reconciliada com responsável humano.

## ADR-030 — auditoria USDt com decisão deny-by-default

- **Data:** 2026-07-14
- **Status:** implementada na Etapa 8; resultado operacional `NO_GO`
- **Decisão:** fixar USDt Liquid mainnet no asset ID oficial e precisão 8, manter USDC fora, limitar a sondagem de rota a preparação de 1 USDt e slippage de 1%, sem executar `sendPayment`. Um relatório `GO` exige rota fresca, backup/restauração isolada equivalente, zero reembolsáveis, zero resultados desconhecidos, carteira até 10.000 sats, ledger conciliado, diretório persistente e responsável nomeado.
- **Consequências:** o PostgreSQL registra relatório e checks idempotentes e rejeita `GO` inconsistente. A implementação técnica da auditoria não autoriza fundos nem Fase 9. Sem credenciais, responsável e provas reais, a decisão permanece `NO_GO`.

## ADR-031 — demo mainnet com dupla autorização e circuit breaker

- **Data:** 2026-07-14
- **Status:** preparação técnica implementada; ativação operacional pendente
- **Decisão:** uma invoice real da demo exige auditoria `GO`, sessão armada, aprovação humana vigente, operadora identificada por hash, flag mainnet, flag exclusiva da demo e credenciais no cofre. Só uma invoice mainnet pode ficar ativa. Saldo acima do teto, reembolsável, resultado desconhecido ou conciliação divergente abrem um circuit breaker append-only e abortam a sessão.
- **Consequências:** configurar chaves não ativa dinheiro por si só. Testes usam apenas gateways falsos; o fallback `/demo` é local e declara que nenhum fundo foi movimentado. A Fase 9 só termina após invoice mínima real, evento único, ledger balanceado, restauração e conciliação acompanhados.
