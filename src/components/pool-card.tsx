import { ArrowUpRight, Bitcoin, ShieldCheck } from "lucide-react";

type PoolCardProps = {
  label: string;
  title: string;
  amount: string;
  funded: number;
  due: string;
  mode: "btc" | "usd";
};

export function PoolCard({ label, title, amount, funded, due, mode }: PoolCardProps) {
  const Icon = mode === "btc" ? Bitcoin : ShieldCheck;

  return (
    <article className="pool-card">
      <div className="pool-card__topline">
        <span className="tag tag--soft">
          <Icon aria-hidden="true" size={15} />
          {label}
        </span>
        <ArrowUpRight aria-hidden="true" size={20} />
      </div>
      <h3>{title}</h3>
      <div className="pool-card__amount">{amount}</div>
      <div
        className="progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={funded}
        aria-label={`${funded}% financiado`}
      >
        <span style={{ width: `${funded}%` }} />
      </div>
      <div className="pool-card__meta">
        <span>{funded}% financiado</span>
        <span>Vence {due}</span>
      </div>
    </article>
  );
}
