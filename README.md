# Elas Recebem Hoje

MVP de antecipação de pagamentos internacionais em BTC, focado em mulheres no Brasil. Inclui modo demonstrativo sem fundos, PostgreSQL/Drizzle, ledger de partidas dobradas, LNURL-auth, reputação Nostr e autorização opcional NWC para o pagador.

## Rodar localmente

Requisitos: Node.js 24 e a versão de pnpm indicada em `package.json`.

```bash
pnpm install
pnpm dev
```

Acesse `http://localhost:3000`. `pnpm check` roda lint, tipos, testes e build; `pnpm test:db` aplica todas as migrations em PostgreSQL embarcado.

## NWC do pagador

Depois de confirmar o recebível, o pagador pode conectar uma URI `nostr+walletconnect://` compatível com `pay_invoice` ou escolher pagamento manual com qualquer carteira Lightning. NWC é opcional e não participa do login LNURL-auth.

O servidor cifra o secret com AES-256-GCM usando uma chave base64 de 32 bytes. URI, secret e preimage nunca devem aparecer em logs, Nostr ou respostas de leitura.

```bash
NWC_CONNECTION_ENCRYPTION_KEY=<32-bytes-em-base64>
NWC_ENABLE_LIVE=false
```

`NWC_ENABLE_LIVE` permanece `false`. O worker atual usa apenas gateways simulados e não há scheduler de cobrança real. Não habilite mainnet sem auditoria, limites, responsável operacional e autorização explícita.

Comece por `docs/00-contexto-do-projeto.md`, `docs/12-decisoes.md` e `IMPLEMENTATION_PLAN.md`.
