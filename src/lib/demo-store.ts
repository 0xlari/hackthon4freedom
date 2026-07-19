"use client";

import type { PublicPool } from "@/data/public-pools";

const STORAGE_KEY = "erh-hackathon-demo-v1";
export const DEMO_CHANGED_EVENT = "erh:demo-changed";

export type DemoReceivableStatus = "AWAITING_CLIENT" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "POOLED";

export type DemoReceivable = {
  id: string;
  token: string;
  purpose: "SERVICE" | "SALARY" | "SALE" | "COMMISSION" | "OTHER";
  description: string;
  amountUsd: number;
  dueDate: string;
  payerName: string;
  payerCountry: string;
  evidenceName: string;
  status: DemoReceivableStatus;
  createdAt: string;
  payerAcceptedBtc?: boolean;
  payerPaymentMethod?: "NWC_AUTOMATIC" | "MANUAL";
  payerPaymentStatus?: string;
  nwcWalletLabel?: string;
};

export type DemoContribution = {
  id: string;
  poolId: string;
  poolTitle: string;
  amountSats: number;
  expectedSats: number;
  createdAt: string;
};

type DemoState = {
  receivables: DemoReceivable[];
  pools: PublicPool[];
  contributions: DemoContribution[];
};

const emptyState = (): DemoState => ({ receivables: [], pools: [], contributions: [] });

function readState(): DemoState {
  if (typeof window === "undefined") return emptyState();
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as DemoState | null;
    return parsed && Array.isArray(parsed.receivables) && Array.isArray(parsed.pools) && Array.isArray(parsed.contributions)
      ? parsed
      : emptyState();
  } catch {
    return emptyState();
  }
}

function writeState(state: DemoState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new Event(DEMO_CHANGED_EVENT));
}

export function getDemoState() {
  return readState();
}

export function resetDemoState() {
  writeState(emptyState());
}

export function createDemoReceivable(input: Omit<DemoReceivable, "id" | "token" | "status" | "createdAt">) {
  const state = readState();
  const active = state.receivables.some((item) => !["REJECTED"].includes(item.status));
  if (active) throw new Error("Você já possui um recebível ativo nesta demonstração.");
  const receivable: DemoReceivable = {
    ...input,
    id: `r_${crypto.randomUUID().slice(0, 8)}`,
    token: crypto.randomUUID(),
    status: "AWAITING_CLIENT",
    createdAt: new Date().toISOString(),
  };
  state.receivables.unshift(receivable);
  writeState(state);
  return receivable;
}

export function findDemoReceivableByToken(token: string) {
  return readState().receivables.find((item) => item.token === token);
}

export function confirmDemoReceivable(token: string, acceptsBtc: boolean) {
  const state = readState();
  const receivable = state.receivables.find((item) => item.token === token);
  if (!receivable || receivable.status !== "AWAITING_CLIENT") throw new Error("Link inválido ou já utilizado.");
  receivable.payerAcceptedBtc = acceptsBtc;
  receivable.status = acceptsBtc ? "UNDER_REVIEW" : "REJECTED";
  writeState(state);
  return receivable;
}

export function setDemoPayerPayment(receivableId: string, method: "NWC_AUTOMATIC" | "MANUAL", status: string, walletLabel?: string) {
  const state = readState();
  const receivable = state.receivables.find((item) => item.id === receivableId);
  if (!receivable) throw new Error("Recebível demonstrativo não encontrado.");
  receivable.payerPaymentMethod = method;
  receivable.payerPaymentStatus = status;
  receivable.nwcWalletLabel = walletLabel;
  writeState(state);
  return receivable;
}

export function reviewDemoReceivable(receivableId: string, decision: "APPROVE" | "REJECT") {
  const state = readState();
  const receivable = state.receivables.find((item) => item.id === receivableId);
  if (!receivable || receivable.status !== "UNDER_REVIEW") throw new Error("Recebível não aguarda avaliação.");
  if (decision === "REJECT") {
    receivable.status = "REJECTED";
    writeState(state);
    return { receivable };
  }

  const days = Math.max(1, Math.ceil((new Date(receivable.dueDate).getTime() - Date.now()) / 86_400_000));
  const discountBps = Math.min(500, days <= 15 ? 200 : days <= 30 ? 300 : days <= 60 ? 400 : 500);
  const advanceUsd = receivable.amountUsd * (1 - discountBps / 10_000);
  const targetSats = Math.max(1_000, Math.round((advanceUsd / 100_000) * 100_000_000));
  const pool: PublicPool = {
    id: `p_${crypto.randomUUID().slice(0, 8)}`,
    title: receivable.description,
    amount: `${targetSats.toLocaleString("pt-BR")} sats`,
    targetSats,
    fundedSats: 0,
    funded: 0,
    due: `em ${days} dias`,
    fundingDeadline: `${Math.max(1, Math.min(10, days - 1))} dias`,
    discount: `${(discountBps / 100).toLocaleString("pt-BR", { minimumFractionDigits: 1 })}%`,
    discountBps,
    coverage: 35,
    reputation: "Recebível confirmado e aprovado na demonstração",
    isDemo: true,
  };
  receivable.status = "POOLED";
  state.pools.unshift(pool);
  writeState(state);
  return { receivable, pool };
}

export function recordDemoContribution(pool: PublicPool, amountSats: number, expectedSats: number) {
  const state = readState();
  const contribution: DemoContribution = {
    id: `a_${crypto.randomUUID().slice(0, 8)}`,
    poolId: pool.id,
    poolTitle: pool.title,
    amountSats,
    expectedSats,
    createdAt: new Date().toISOString(),
  };
  state.contributions.unshift(contribution);
  const storedPool = state.pools.find((item) => item.id === pool.id);
  if (storedPool) {
    storedPool.fundedSats = Math.min(storedPool.targetSats, storedPool.fundedSats + amountSats);
    storedPool.funded = Math.round((storedPool.fundedSats / storedPool.targetSats) * 100);
  }
  writeState(state);
  return contribution;
}
