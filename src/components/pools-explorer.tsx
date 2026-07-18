"use client";

import { useEffect, useState } from "react";

import { PoolCard } from "@/components/pool-card";
import { publicPools, type PublicPool } from "@/data/public-pools";
import { DEMO_CHANGED_EVENT, getDemoState } from "@/lib/demo-store";

export function PoolsExplorer() {
  const [pools, setPools] = useState<PublicPool[]>(publicPools);
  useEffect(() => {
    const refresh = () => setPools([...getDemoState().pools, ...publicPools]);
    queueMicrotask(refresh);
    window.addEventListener(DEMO_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(DEMO_CHANGED_EVENT, refresh);
  }, []);
  return <div className="pool-grid">{pools.map((pool) => <PoolCard key={pool.id} pool={pool} />)}</div>;
}
