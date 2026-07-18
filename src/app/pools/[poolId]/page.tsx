import type { Metadata } from "next";
import { PoolDetailsClient } from "@/components/pool-details-client";
import { findPublicPool, publicPools } from "@/data/public-pools";

export function generateStaticParams() { return publicPools.map(({ id }) => ({ poolId: id })); }

export async function generateMetadata({ params }: { params: Promise<{ poolId: string }> }): Promise<Metadata> {
  const pool = findPublicPool((await params).poolId);
  if (!pool) return {};
  return { title: pool.title, description: `Pool BTC ${pool.funded}% financiada, com ${pool.coverage}% de cobertura do principal.` };
}

export default async function PoolDetailsPage({ params }: { params: Promise<{ poolId: string }> }) {
  return <div className="inner-page"><PoolDetailsClient poolId={(await params).poolId} /></div>;
}
