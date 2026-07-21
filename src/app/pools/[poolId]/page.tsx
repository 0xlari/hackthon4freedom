import type { Metadata } from "next";
import { PoolDetailsSource } from "@/components/pool-details-source";
import { PoolDetailsClient } from "@/components/pool-details-client";
import { lrpOriginationModeFromEnvironment } from "@/config/lrp-mode";
import { findPublicPool, publicPools } from "@/data/public-pools";

export function generateStaticParams() { return publicPools.map(({ id }) => ({ poolId: id })); }

export async function generateMetadata({ params }: { params: Promise<{ poolId: string }> }): Promise<Metadata> {
  const pool = findPublicPool((await params).poolId);
  if (!pool) return {};
  return { title: pool.title, description: `Pool BTC ${pool.funded}% financiada, com ${pool.coverage}% de cobertura do principal.` };
}

export default async function PoolDetailsPage({ params }: { params: Promise<{ poolId: string }> }) {
  const poolId = (await params).poolId;
  const mode = lrpOriginationModeFromEnvironment();
  const isKnownLegacyPool = mode !== "LRP" && Boolean(findPublicPool(poolId));
  return <div className="inner-page">{isKnownLegacyPool ? <PoolDetailsClient poolId={poolId} /> : <PoolDetailsSource poolId={poolId} mode={mode} />}</div>;
}
