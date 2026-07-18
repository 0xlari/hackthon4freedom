export type PublicPool = {
  id: string;
  title: string;
  amount: string;
  funded: number;
  due: string;
  fundingDeadline: string;
  discount: string;
  coverage: number;
  reputation: string;
};

export const publicPools: PublicPool[] = [
  { id: "p_7f3k9m", title: "Projeto criativo internacional", amount: "1.840.000 sats", funded: 72, due: "em 24 dias", fundingDeadline: "6 dias", discount: "4,2%", coverage: 35, reputation: "Identidade e histórico verificados" },
  { id: "p_2n8q4c", title: "Venda para cliente no exterior", amount: "950.000 sats", funded: 41, due: "em 18 dias", fundingDeadline: "9 dias", discount: "3,6%", coverage: 50, reputation: "Identidade verificada" },
  { id: "p_9v5r1a", title: "Campanha para marca global", amount: "2.110.000 sats", funded: 88, due: "em 11 dias", fundingDeadline: "2 dias", discount: "2,9%", coverage: 62, reputation: "Duas operações concluídas" },
];

export function findPublicPool(id: string) {
  return publicPools.find((pool) => pool.id === id);
}
