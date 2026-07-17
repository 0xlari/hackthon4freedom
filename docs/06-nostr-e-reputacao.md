# Nostr e reputação

## Objetivo

Permitir que participantes carreguem evidências assinadas de histórico sem publicar documentos ou transformar uma pontuação central em verdade universal. O banco interno continua necessário para autorização, privacidade, contestação e cálculo contextual.

## Identidade e assinatura

- O acesso à plataforma usa LNURL-auth; Nostr não é login.
- A plataforma associa a reputação a um `reputation_id` aleatório, separado da linking key LNURL-auth e do endereço Lightning.
- Participantes não precisam fornecer pubkey, signer ou `nsec` Nostr.
- Android poderá usar NIP-55 futuramente.
- A plataforma nunca solicita, recebe, registra ou recupera `nsec`.
- A identidade institucional da plataforma assina atestados emitidos por suas regras.

## Modelo de reputação dimensional

Não existe uma única “nota de confiança”. A interface mostra dimensões e evidências:

1. **Identidade:** níveis verificados e validade, sem expor documentos.
2. **Recebíveis:** confirmados, concluídos, corrigidos e contestados.
3. **Pagamento do cliente:** pontualidade, atraso e inadimplência.
4. **Participação:** pools financiadas, reembolsos e distribuições.
5. **Garantia:** faixa de cobertura ativa, nunca endereço ou saldo exato público.
6. **Antiguidade/consistência:** tempo e diversidade de emissores.

O limite de crédito usa regras internas transparentes e pode consumir esses sinais. Seguidores ou popularidade não equivalem a solvência.

## Emissores e confiança

Cada fato registra emissor, relação com a operação, momento, fonte, validade e status de correção. A confiança depende da pubkey do emissor, histórico, independência e escopo da declaração. Assinatura prova autoria e integridade, não veracidade.

## NIPs avaliadas

| NIP | Uso | Decisão e limitações |
|---|---|---|
| NIP-01 | Evento, assinatura e referências | Obrigatória; não define semântica de reputação. |
| NIP-07 | Signer de navegador | Fora do acesso e do fluxo obrigatório da participante. |
| NIP-46 | Signer remoto | Pode operar o signer institucional externo; nunca recebe `nsec` da participante. |
| NIP-98 | Autorização HTTP assinada | Fora do login do MVP, substituído por LNURL-auth. |
| NIP-32 | Labels | Avaliada; útil para rótulos, mas pode facilitar abuso e tem semântica insuficiente para crédito. Não será base única. |
| NIP-58 | Badges | Escolhida apenas para conquistas positivas; badge não representa risco financeiro. |
| NIP-85 | Trusted Assertions | Avaliada; o draft atual enumera métricas de terceiros e não define os fatos operacionais deste produto. Não será usado no MVP. |
| NIP-09 | Pedido de exclusão | Suporta correção social, mas relays podem manter cópias; não promete apagamento. |
| NIP-40 | Expiração | Útil para sinais temporários; relays podem não apagar imediatamente. |
| NIP-42 | Autenticação em relay | Útil em relay controlado; não substitui autorização da aplicação. |
| NIP-65 | Lista de relays | Útil para descoberta; requer fallback configurado. |

Decisão do MVP: evento de aplicação addressable `kind 30078`, com schema versionado `erh.reputation.v1`. O `d` inclui `reputation_id` pseudônimo, tipo de fato e referência opaca da operação, preservando correções append-only. Eventos desconhecidos podem ser ignorados por outros clientes; o espelho interno permanece a fonte para autorização e contestação.

## Tipos de atestado

`identity_level_verified`, `receivable_confirmed`, `pool_funded`, `repayment_on_time`, `repayment_late`, `operation_completed`, `dispute_resolved`, `badge_awarded`.

No MVP público, priorizar eventos positivos e não sensíveis. A publicação de eventos negativos identificáveis exige consentimento, política de contestação e revisão jurídica. Internamente, sinais negativos continuam necessários para risco e segurança.

## Payload seguro de exemplo

```json
{
  "schema": "erh.reputation.v1",
  "subject": "<reputation_id pseudônimo>",
  "assertion": "operation_completed",
  "operation_ref": "opaque-random-reference",
  "occurred_at": "2026-07-14T00:00:00Z",
  "evidence_hash": "hash-of-canonical-internal-attestation",
  "issuer_role": "platform"
}
```

Não incluir valor, moeda, cliente, vencimento real, contrato, contato, localização ou ID interno previsível.

## Publicação e leitura

- Validar ID e assinatura antes de aceitar evento.
- Deduplicar por event ID e chave semântica.
- Publicar em pelo menos dois relays configurados, registrando confirmação por relay.
- Fila de retry não bloqueia dinheiro.
- Resultados de relays são cacheados e reconciliados.
- Eventos conflitantes permanecem visíveis no histórico interno; correção referencia o anterior.

## Revogação e correção

Nostr é append-only na prática. Uma correção publica novo evento assinado referenciando o anterior e altera o estado interno. NIP-09 pode solicitar exclusão, sem garantia. A interface deve preferir a declaração válida mais recente sem apagar a trilha.

## Portabilidade e Sybil

O `reputation_id` pode ser compartilhado voluntariamente, mas não autentica a conta e não revela a linking key da carteira. Criar carteiras é barato, então a plataforma não concede limite relevante apenas por autenticar uma chave. Sinais ganham peso quando emitidos por fontes reconhecidas, ligados a operações reais e acumulados ao longo do tempo.

## Referência

[Repositório oficial de NIPs](https://github.com/nostr-protocol/nips)
