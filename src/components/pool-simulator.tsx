"use client";

import { useMemo, useState } from "react";
import { Bitcoin, Calculator, ShieldCheck, TriangleAlert } from "lucide-react";

import { simulatePool, usdCentsToSatsRoundUp, type PoolMode, type RiskBand } from "@/domain/pool";

function parseUsdCents(value: string) {
  const normalized = value.replace(",", ".");
  if (!/^\d{1,9}(\.\d{0,2})?$/.test(normalized)) return null;
  const [whole, decimals = ""] = normalized.split(".");
  return BigInt(whole) * 100n + BigInt(decimals.padEnd(2, "0"));
}

function formatUsd(cents: bigint) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "USD" }).format(Number(cents) / 100);
}

function formatSats(sats: bigint) {
  return `${new Intl.NumberFormat("pt-BR").format(sats)} sats`;
}

function formatUsdt(units: bigint) {
  const whole = units / 100_000_000n;
  const decimals = (units % 100_000_000n).toString().padStart(8, "0").slice(0, 2);
  return `${new Intl.NumberFormat("pt-BR").format(whole)},${decimals} USDt`;
}

export function PoolSimulator() {
  const [mode, setMode] = useState<PoolMode>("FULL_BTC");
  const [nominal, setNominal] = useState("2000.00");
  const [days, setDays] = useState("30");
  const [risk, setRisk] = useState<RiskBand>("LOW");
  const [btcPrice, setBtcPrice] = useState("60000.00");
  const [costs, setCosts] = useState("10.00");

  const result = useMemo(() => {
    const nominalUsdCents = parseUsdCents(nominal);
    const btcPriceUsdCents = parseUsdCents(btcPrice);
    const externalCostsUsdCents = parseUsdCents(costs);
    const daysToDue = Number(days);
    if (!nominalUsdCents || !btcPriceUsdCents || externalCostsUsdCents === null || !Number.isInteger(daysToDue)) return null;
    try {
      return simulatePool({ mode, nominalUsdCents, daysToDue, risk, btcPriceUsdCents, externalCostsUsdCents });
    } catch {
      return null;
    }
  }, [btcPrice, costs, days, mode, nominal, risk]);

  const volatility = useMemo(() => {
    if (!result) return null;
    const price = parseUsdCents(btcPrice)!;
    return {
      btcUp: usdCentsToSatsRoundUp(result.nominalUsdCents, (price * 120n) / 100n),
      btcDown: usdCentsToSatsRoundUp(result.nominalUsdCents, (price * 80n) / 100n),
    };
  }, [btcPrice, result]);

  return (
    <section className="pool-simulator" aria-labelledby="simulator-title">
      <div className="pool-simulator__heading">
        <span className="eyebrow"><Calculator aria-hidden="true" size={15} /> Simulador v0.1</span>
        <h2 id="simulator-title">Veja cada centavo antes de decidir.</h2>
        <p>Cotação e custos são fictícios. Nenhuma invoice, swap ou promessa de retorno é criada aqui.</p>
      </div>

      <div className="pool-simulator__body">
        <form className="simulator-controls" onSubmit={(event) => event.preventDefault()}>
          <fieldset className="mode-toggle">
            <legend>Modalidade</legend>
            <label className={mode === "FULL_BTC" ? "is-selected" : ""}><input type="radio" name="mode" checked={mode === "FULL_BTC"} onChange={() => setMode("FULL_BTC")} /><Bitcoin aria-hidden="true" /> Full BTC</label>
            <label className={mode === "USD_PAIRED" ? "is-selected" : ""}><input type="radio" name="mode" checked={mode === "USD_PAIRED"} onChange={() => setMode("USD_PAIRED")} /><ShieldCheck aria-hidden="true" /> Pareada em USDt</label>
          </fieldset>
          <div className="simulator-fields">
            <label>Recebível em USD<input value={nominal} inputMode="decimal" onChange={(event) => setNominal(event.target.value)} /></label>
            <label>Dias até vencer<input value={days} type="number" min="1" max="90" onChange={(event) => setDays(event.target.value)} /></label>
            <label>Faixa de risco<select value={risk} onChange={(event) => setRisk(event.target.value as RiskBand)}><option value="LOW">Baixo</option><option value="MEDIUM">Médio</option><option value="HIGH">Alto</option></select></label>
            <label>BTC em USD<input value={btcPrice} inputMode="decimal" onChange={(event) => setBtcPrice(event.target.value)} /></label>
            <label>Taxas e spread da solicitante em USD<input value={costs} inputMode="decimal" onChange={(event) => setCosts(event.target.value)} /></label>
          </div>
        </form>

        <div className="simulator-result" aria-live="polite">
          {result ? (
            <>
              <div className="simulator-result__top"><span>Meta de antecipação</span><strong>{formatUsd(result.advanceUsdCents)}</strong><small>{formatSats(result.fundingTargetSats)} pela cotação simulada</small></div>
              <dl>
                <div><dt>Valor nominal</dt><dd>{formatUsd(result.nominalUsdCents)}</dd></div>
                <div><dt>Desconto ({(result.discountBps / 100).toFixed(2).replace(".", ",")}%)</dt><dd>− {formatUsd(result.grossDiscountUsdCents)}</dd></div>
                <div><dt>Taxas e spread pagos pela solicitante</dt><dd>− {formatUsd(result.requesterCostsUsdCents)}</dd></div>
                <div className="result-line"><dt>Líquido recebido pela solicitante</dt><dd>{formatUsd(result.requesterNetDisbursementUsdCents)}</dd></div>
                <div><dt>Resultado da pool</dt><dd>{formatUsd(result.netResultUsdCents)}</dd></div>
                <div><dt>Plataforma — 30%</dt><dd>{formatUsd(result.platformResultUsdCents)}</dd></div>
                <div><dt>Aportadoras — 70%</dt><dd>{formatUsd(result.contributorsResultUsdCents)}</dd></div>
              </dl>
              <p className="confirmation-form__note">Taxas e spread reduzem apenas o valor líquido recebido pela solicitante; não são descontados da pool nem do retorno das aportadoras.</p>
              <div className={`risk-explanation risk-explanation--${mode === "FULL_BTC" ? "btc" : "usdt"}`}>
                {mode === "FULL_BTC" ? <Bitcoin aria-hidden="true" /> : <ShieldCheck aria-hidden="true" />}
                <span><strong>{mode === "FULL_BTC" ? "A quantidade de sats varia." : "O principal é acompanhado em USDt Liquid."}</strong>{mode === "FULL_BTC" ? ` Neste cenário, o pagamento nominal equivaleria de ${formatSats(volatility!.btcUp)} a ${formatSats(volatility!.btcDown)} com variação de ±20% no BTC.` : ` A obrigação simulada é ${formatUsdt(result.pairedObligationUsdtUnits)}; a quantidade paga em sats ainda depende da cotação de saída.`}</span>
              </div>
              <div className="simulation-lock"><TriangleAlert aria-hidden="true" /> Gateway Breez mainnet integrado; invoices, swaps e movimentação permanecem bloqueados sem flag, segredos e conciliação operacional.</div>
            </>
          ) : <p className="simulator-error">Informe valores válidos: prazo entre 1 e 90 dias e quantias positivas.</p>}
        </div>
      </div>
    </section>
  );
}
