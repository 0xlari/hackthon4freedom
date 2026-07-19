# Plano de implementação — fonte de verdade

## Estado atual

- [x] Repositório inspecionado: vazio, sem commits ou aplicação.
- [x] Descoberta de produto consolidada.
- [x] Documentação inicial criada.
- [x] Revisão/aprovação da fundadora.
- [x] Mensagem exata `APROVADO PARA IMPLEMENTAR` recebida.
- [x] Implementação iniciada pela Etapa 0 documental.

## Objetivo

Entregar um MVP demonstrável de antecipação de recebível, com validação da plataforma, pools exclusivamente BTC, aporte não custodial por DLC, distribuição Lightning controlada, ledger correto e reputação Nostr sem dados sensíveis.

## Etapas

- [x] 0. Confirmar decisões, stack, país, limites e guardrails.
- [x] 1. Criar fundação e design system.
- [x] 2. Implementar domínio, banco e ledger.
- [x] 3. Implementar identidade, limite e reputação interna.
- [x] 4. Implementar recebível, cliente e validação.
- [x] 5. Implementar pools e simulador financeiro.
- [ ] 6. Integrar Breez SDK Liquid e Lightning diretamente em mainnet, bloqueada por flag e tetos.
- [x] 7. Integrar Nostr.
- [x] 8. Auditar USDt Liquid e preparar mainnet controlada — resultado operacional `NO_GO`.
- [ ] 9. Auditar, habilitar aporte mainnet mínimo e ensaiar demo.
- [ ] 10. Implementar páginas públicas compartilháveis e distribuição comunitária opcional via Fedi.
- [x] 11. Simplificar a experiência em painel único, remover páginas redundantes, adotar BTC-only e preparar compartilhamento por WhatsApp.
- [ ] 12. Implementar carteira contratual autocustodial, DLC, oráculo e reembolso antes de qualquer aporte relevante.

Detalhes e critérios estão em `docs/09-plano-de-implementacao.md`.
O plano de execução específico da Etapa 10 está em `docs/18-fedi-comunidade-e-compartilhamento-de-pools.md`.

## Dependências resolvidas na Etapa 0

- Stack inicial confirmada.
- Tetos monetários definidos; carteira e responsável serão exigidos somente antes da Etapa 9.
- Fonte/limite demonstrativo da reserva definidos.
- Fórmula demonstrativa do limite progressivo definida.
- Piloto Brasil/cliente exterior/USD de referência, aceite obrigatório do cliente e liquidação somente em BTC definidos.
- USDt na Liquid é a única stablecoin escolhida; o gateway mainnet foi autorizado na Etapa 6, enquanto aumento de limites e abertura operacional permanecem responsabilidade da Etapa 8.

## Validações obrigatórias

- [x] Threat model documental revisado em `docs/07-seguranca-privacidade-e-riscos.md` e nos table-tops de `docs/14-guardrails-operacionais.md`.
- [x] Ledger balanceado e testado por propriedades.
- [ ] Backup/restauração exercitados.
- [x] Payload Nostr revisado manualmente.
- [x] Nenhum segredo ou PII no repositório; varredura local não encontrou chave privada, `nsec`, mnemonic ou API key preenchida.
- [x] Plano alternativo da demo ensaiado localmente, sem rede ou fundos, na rota `/demo`.
- [ ] Avaliação jurídica antes de operação pública.

## Decisões futuras que não bloqueiam a Etapa 1

1. Provedores comerciais e hospedagem.
2. Países/moedas além do cenário USD com cliente fictício no exterior.
3. Calibração das fórmulas com dados reais.
4. Haircut e execução de garantias reais.
5. Capitalização e termos jurídicos da cobertura pública.
6. Liquidez, swaps, custódia e recuperação do USDt Liquid via Breez SDK permanecem auditáveis na Etapa 8, mesmo com o gateway mainnet introduzido na Etapa 6.
7. Fonte e rebalanceamento real da tesouraria BTC da pool pareada.
8. Termos de reembolso após swaps reais.
9. Responsável e carteira mainnet da demo antes da Etapa 9.

## Progresso

Atualizar este arquivo ao concluir cada etapa, com links para testes, decisões e limitações. Não avançar com testes financeiros quebrados sem registrar bloqueio e impacto.

### Registro de 2026-07-14

Etapa 0 concluída e validada em `docs/14-guardrails-operacionais.md`.

Etapa 1 concluída com a fundação Next.js, identidade visual, componentes reutilizáveis e rotas estáticas `/`, `/como-funciona`, `/pools` e `/entrar`. Validações executadas: lint, tipos, testes unitários/de componentes, build de produção, inspeção no navegador e testes E2E em Chromium desktop e Pixel 7. Nenhuma operação financeira, autenticação, integração ou publicação foi habilitada nessa etapa.

Etapa 2 concluída com domínio monetário baseado em inteiros, máquinas de estado, schema PostgreSQL/Drizzle, quatro migrations versionadas, repositórios transacionais de ledger e aporte, transactional outbox e constraints financeiras. O ledger fecha por ativo e fica imutável após publicação; referências externas e chaves idempotentes são únicas; pools não ultrapassam a meta nem aceitam dupla alocação; recebível sem aceite BTC não pode ser aprovado nem originar pool. Validações executadas: lint, tipos, 26 testes unitários/de propriedades/integração, migration do zero em PostgreSQL embarcado, build e 4 testes E2E. Nenhuma integração externa ou movimentação real foi habilitada nessa etapa.

Etapa 3 concluída com regra de limite v0.1, evidências consentidas, consentimentos revogáveis, garantias restritas à simulação, fatos de reputação interna, histórico append-only e reserva/liberação transacional do limite. A nova rota `/limite` explica a composição e os bloqueios usando somente perfil fictício. Expiração e revogação podem reduzir o total sem apagar obrigações existentes; concorrência não permite consumo duplo. Validações executadas: lint, tipos, 41 testes unitários/de propriedades/integração, 18 testes PostgreSQL partindo de banco vazio, build e 6 testes E2E em desktop/celular. Nenhuma conexão social, garantia real, autenticação Nostr ou operação financeira foi habilitada. A Etapa 4 não foi iniciada.

Etapa 4 concluída com recebíveis versionados, referências privadas de evidência, validação de metadados de upload, link de confirmação de uso único e pipeline determinístico da plataforma. O token bruto é entregue somente no fragmento do link, removido da barra pelo cliente e nunca persistido; o PostgreSQL guarda apenas SHA-256. Recusa de BTC encerra o recebível, divergência exige correção com nova versão e duplicidade/limite insuficiente impedem aprovação. Histórico de inadimplência do cliente vai para revisão administrativa excepcional, sem endpoint público, com justificativa e auditoria append-only. As rotas `/recebivel` e `/confirmar` comunicam o fluxo; o cadastro público continua bloqueado até autenticação. Validações executadas: lint, tipos, 54 testes unitários/de componentes/integração, 25 testes PostgreSQL partindo de banco vazio, build e 10 testes E2E em desktop/celular. Object storage, envio do link, autenticação e pagamento Lightning não foram habilitados. A Etapa 5 não foi iniciada.

Etapa 5 concluída com regras financeiras inteiras e versionadas para desconto por prazo/risco limitado a 5%, meta de antecipação, cotação simulada, split 30/70 e distribuição proporcional com resíduo determinístico. Taxas, spread e custos de recebimento são cobrados separadamente da solicitante e reduzem seu desembolso líquido; não reduzem a pool nem o retorno das aportadoras. Pools Full BTC explicitam a variação de sats; pools pareadas registram obrigação USDt Liquid separada da reserva de tesouraria BTC. O banco reserva capacidade atomicamente antes da invoice, impede sobre-financiamento concorrente e exige decisão imutável da solicitante para aceitar parcial ou iniciar reembolso. A rota `/pools` ganhou simulador responsivo, com valores fictícios. Esse registro antecede o início da Etapa 6.

Etapa 6 implementada tecnicamente para mainnet, conforme substituição expressa registrada na ADR-029, mas o aceite operacional permanece pendente. O pacote oficial `@breeztech/breez-sdk-liquid` está fixado em 0.12.4 e carregou em Node 24 com configuração mainnet. Adapter, worker de eventos/polling, invoices, swaps L-BTC/USDt, backup/restauração, reconciliação e ledger foram isolados no servidor. O PostgreSQL ganhou registros idempotentes de pagamentos, eventos, swaps, sessões mainnet e conciliações em duas migrations. Mainnet continua desligada sem flag, API key e mnemonic; asset IDs são allowlisted; invoices, sessão e carteira quente são limitadas respectivamente a 1.000, 5.000 e 10.000 sats. Resultados desconhecidos bloqueiam retry. Nenhum fundo foi movimentado. A etapa só será marcada concluída após uma invoice controlada ser paga, registrada uma vez e reconciliada por responsável operacional seguindo `docs/15-runbook-breez-mainnet.md`.

Etapa 7 foi corrigida em 2026-07-15 pela ADR-032: Supabase Auth por link mágico passou a ser o acesso principal, e Nostr ficou restrito ao vínculo opcional de reputação após autenticação. O desafio NIP-98 continua efêmero e de uso único, agora associado à usuária Supabase; não cria sessão Nostr nem autoriza finanças. NIP-46 permanece isolada atrás da interface e nenhum `nsec` é recebido ou persistido. Atestações positivas continuam mínimas, sem PII, valores ou dados do pagador; falha de signer ou relay não bloqueia fluxos da plataforma.

Correção de identidade aprovada em 2026-07-16 pela ADR-033: o link mágico foi substituído por LNURL-auth. A API emite desafio de cinco minutos e uso único, valida assinatura secp256k1 da linking key específica do domínio, associa seu hash a um usuário/reputation_id opaco e entrega sessão revogável por cookie `HttpOnly`. E-mail, telefone, endereço de pagamento e signer Nostr não são credenciais. O login não habilita mainnet financeira; callback móvel real depende da publicação HTTPS estável de `auth.agendacryptoo.com`. Vínculo de carteiras adicionais e recuperação permanecem próximos incrementos de identidade.

Etapa 8 concluída como auditoria técnica reproduzível, com decisão operacional `NO_GO`. O asset ID e a precisão 8 do Tether USDt Liquid mainnet foram conferidos na documentação oficial; USDC permanece fora. O código ganhou avaliação `GO`/`NO_GO`, sondagem prepare-only protegida por flag separada, cotação de 60 segundos, teto de slippage de 1%, snapshots com hash para backup/restauração isolada, rescan, contagem de reembolsáveis/resultados desconhecidos e persistência idempotente. A migration 14 elevou o schema a 37 tabelas e impede `GO` incompatível com os guardrails. Foram validados allowlist, precisão e round-trip de unidades, quote expirada, slippage, ausência de execução, reembolsáveis, resultado desconhecido, restauração divergente, reconciliação, idempotência e constraints partindo de banco vazio; lint, tipos, regressões e build ficaram verdes. Sem responsável nomeado, segredos em cofre, diretórios persistentes, rota real, restauração real e conciliação, a decisão permanece `NO_GO`; nenhuma conexão financeira ou movimentação ocorreu.

Etapa 9 preparada tecnicamente sem ativação financeira: as migrations 15–16 elevaram o schema a 40 tabelas e introduziram sessão vinculada à auditoria, aprovação humana expirável, tetos fixos, invoice mainnet ativa única e circuit breaker append-only. A criação de invoice agora exige auditoria `GO`, sessão ativa, aprovação vigente, duas flags e credenciais. O monitor aborta a sessão diante de saldo excessivo, reembolsável, resultado desconhecido ou conciliação divergente. A rota `/demo` ensaia o roteiro e o fallback inteiramente offline, sempre marcado como sem fundos. A etapa continua aberta até operadora, cofre, diretórios persistentes, restauração real e uma invoice mínima paga e reconciliada.

Etapa 11 concluída em 2026-07-18 no escopo de experiência e arquitetura aprovada: o acesso LNURL-auth agora segue diretamente para `/painel`; o painel reúne criação de recebível, pools disponíveis, limite/missões, recebíveis originados e aportes realizados. Uma pessoa pode atuar nos dois papéis, mas somente um recebível ativo é permitido por vez. As rotas redundantes `/demo`, `/limite` e `/reputacao` e seus componentes foram removidos. As pools públicas ficaram exclusivamente BTC, com identificadores opacos, cobertura do principal, risco não coberto e compartilhamento por WhatsApp sem PII. USDt passou ao roadmap. O perfil ainda exibe estados vazios até a próxima etapa ligar os históricos ao PostgreSQL; cadastro completo, upload, confirmação funcional do pagador e aporte DLC não foram ativados. Validações executadas: lint, tipos, 108 testes unitários/de componentes, build de produção, inspeção visual desktop/celular e 14 testes E2E em Chromium desktop e Pixel 7. A Etapa 12 não foi iniciada.

Complemento demonstrativo da Etapa 11 concluído em 2026-07-18 pela ADR-037: depois do login por carteira, o navegador permite cadastrar um recebível, gerar o link do pagador, simular sua assinatura/aceite de BTC, avaliar sem senha na rota `/administracao`, criar a pool BTC, calcular retorno aproximado e registrar um aporte demonstrativo. O painel passa a mostrar recebíveis e aportes desta execução, e a administração pode reiniciar o roteiro. O estimador informa resultado central e cenários BTC ±10%, sempre como aproximação. O estado é local ao navegador e não movimenta fundos; persistência PostgreSQL, assinatura real do pagador, administração com MFA, carteira operacional de distribuição e DLC permanecem etapas posteriores. Validações: lint, tipos, 110 testes unitários/de componentes, build, inspeção visual e 16 testes E2E desktop/celular. A Etapa 12 não foi iniciada.

Etapa 13 concluída tecnicamente em 2026-07-18 pela ADR-038: o pagador confirma sem depender de NWC e então escolhe autorização automática única ou Lightning manual. A migration 18 adiciona autorizações, conexões cifradas e tentativas; APIs usam token por recurso, mesma origem e rate limit, sem devolver o secret. O worker simulado cria invoice idempotente, liquida uma vez no ledger, cria fallback manual e não repete resultado desconhecido. O adapter NIP-47 real continua bloqueado por flag. Validações: lint sem erros, tipos, 137 testes, PostgreSQL vazio, 20 E2E desktop/mobile (18 na primeira execução e 2 cenários lentos aprovados isoladamente) e build. Mainnet, scheduler real e cobrança automática permanecem desabilitados.

Correção de perfil aplicada em 2026-07-19 pela ADR-039: a API de sessão passou a devolver um identificador pseudônimo derivado do `reputation_id`, sem expor a linking key da carteira. O estado demonstrativo foi migrado para namespaces separados por perfil, enquanto pools públicas continuam visíveis a todas as pessoas. “Trocar carteira” revoga o cookie atual antes de emitir outro desafio. O estado legado compartilhado não é migrado automaticamente. A persistência de autenticação permanece no PostgreSQL; recebíveis e aportes do roteiro do hackathon continuam locais ao navegador e precisam ser ligados ao banco para sincronização entre dispositivos.
