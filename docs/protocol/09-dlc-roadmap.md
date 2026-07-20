# Roadmap de DLC

## Estado desta versão

DLC real não faz parte da vertical v0.1. Serão definidos apenas interfaces, schemas de prova e fake determinístico em etapa posterior. Nenhum aporte on-chain, funding transaction ou settlement será criado.

## Interface futura

O gateway deverá separar criação de oferta, aceite, prova de funding e consulta de status. A contraparte inicial será o cliente originador, explicitamente centralizado e substituível.

## Guardrails futuros

- funding outpoint público e verificável;
- reembolso pré-assinado/timelock testado;
- liquidação inicial on-chain;
- taxa on-chain estimada limitada a 2% do aporte;
- chaves sob controle das partes, nunca derivadas silenciosamente pela plataforma;
- recuperação, indisponibilidade do oráculo e reorg testados antes de mainnet.

## Condição para ativação

Revisão criptográfica independente, test vectors cruzados, teste em ambiente sem fundos reais, runbook de recuperação, aprovação operacional explícita e atualização dos guardrails. Este documento não concede essa autorização.
