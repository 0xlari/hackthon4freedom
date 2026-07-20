import type { ProtocolSignedEvent } from "../schemas";
import { resolveEventGraph, type GraphRejection } from "../references";

export type ReceivableProjection = Readonly<{
  receivableEventId: string;
  receivableId: string;
  providerPubkey: string;
  commitmentsByOriginator: Readonly<Record<string, readonly string[]>>;
  decisionsByClient: Readonly<Record<string, readonly Readonly<{ eventId: string; decision: string; policyVersion: string }>[]>>;
}>;

export function reduceReceivableState(inputs: readonly ProtocolSignedEvent[]) {
  const graph = resolveEventGraph(inputs);
  const projections: ReceivableProjection[] = [];
  for (const root of graph.events.filter((item) => item.content.event_type === "ReceivableCreated")) {
    if (root.content.event_type !== "ReceivableCreated") continue;
    const commitments: Record<string, string[]> = {};
    const decisions: Record<string, { eventId: string; decision: string; policyVersion: string }[]> = {};
    for (const item of graph.events) {
      if (item.content.event_type === "PayerCommitmentProof" && item.content.receivable_event_id === root.event.id) (commitments[item.content.originator_pubkey] ??= []).push(item.event.id);
      if (item.content.event_type === "ClientValidationDecision" && item.content.receivable_event_id === root.event.id) (decisions[item.content.client_pubkey] ??= []).push({ eventId: item.event.id, decision: item.content.decision, policyVersion: item.content.policy_version });
    }
    projections.push({ receivableEventId: root.event.id, receivableId: root.content.receivable_id, providerPubkey: root.event.pubkey, commitmentsByOriginator: commitments, decisionsByClient: decisions });
  }
  return { receivables: projections.sort((left, right) => left.receivableId.localeCompare(right.receivableId)), rejected: graph.rejected as readonly GraphRejection[] };
}
