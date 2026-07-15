import { expect, test } from "@playwright/test";

test("home exposes the product promise and navigation", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /Seu pagamento já tem data/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Entenda como funciona", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Pagamento em BTC aceito")).toBeVisible();
});

test("layout does not overflow the viewport", async ({ page }) => {
  await page.goto("/");

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );

  expect(hasHorizontalOverflow).toBe(false);
});

test("limit page explains the rule and simulation boundary", async ({ page }) => {
  await page.goto("/limite");

  await expect(
    page.getByRole("heading", {
      name: "Seu limite cresce com provas, não com popularidade.",
    }),
  ).toBeVisible();
  await expect(page.getByText("Somente simulação")).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test("receivable page assigns validation to the platform", async ({ page }) => {
  await page.goto("/recebivel");
  await expect(page.getByRole("heading", { name: /Você cadastra/i })).toBeVisible();
  await expect(page.getByText("Avaliação da plataforma")).toBeVisible();
  await expect(page.getByText(/Salário, venda, comissão, serviço ou outro/i)).toBeVisible();
  await expect(page.getByText(/disponível após autenticação segura/i)).toBeVisible();
});

test("confirmation page rejects a missing one-time token", async ({ page }) => {
  await page.goto("/confirmar");
  await expect(page.getByText(/link é inválido, expirou ou já foi usado/i)).toBeVisible();
});

test("Nostr login explains signer safety and fails safely without NIP-07", async ({ page }) => {
  await page.goto("/entrar");
  await expect(page.getByRole("heading", { name: /Entre sem entregar sua chave privada/i })).toBeVisible();
  await expect(page.getByText(/não autoriza pagamentos/i)).toBeVisible();
  await page.getByRole("button", { name: /Entrar com signer Nostr/i }).click();
  await expect(page.getByText(/Nenhum signer NIP-07 foi encontrado/i)).toBeVisible();
  await expect(page.getByText(/Nunca cole ou envie sua chave privada nsec/i)).toBeVisible();
});

test("pool simulator compares Full BTC and USDt without enabling funds", async ({ page }) => {
  await page.goto("/pools");
  await expect(page.getByRole("heading", { name: /Veja cada centavo/i })).toBeVisible();
  await page.getByRole("radio", { name: /Pareada em USDt/i }).check();
  await expect(page.getByText(/principal é acompanhado em USDt Liquid/i)).toBeVisible();
  await expect(page.getByText(/Gateway Breez mainnet integrado/i)).toBeVisible();
  await expect(page.getByText(/não são descontados da pool nem do retorno/i)).toBeVisible();
  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test("controlled demo has a fundless offline fallback", async ({ page }) => {
  await page.goto("/demo");
  await expect(page.getByText("DEMONSTRAÇÃO — nenhum fundo movimentado")).toBeVisible();
  await page.getByRole("button", { name: "Fallback offline" }).click();
  await expect(page.getByText(/não cria invoice, não conecta ao Breez SDK/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /pagar|ativar mainnet/i })).toHaveCount(0);
});
