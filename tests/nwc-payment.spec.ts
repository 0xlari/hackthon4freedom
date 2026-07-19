import { expect, test, type Page } from "@playwright/test";

async function createConfirmedDemoReceivable(page: Page) {
  await page.route("**/api/auth/session", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ authenticated: true }) });
  });
  await page.goto("/recebivel");
  const dueDate = new Date(Date.now() + 20 * 86_400_000).toISOString().slice(0, 10);
  await page.getByLabel("Data combinada").fill(dueDate);
  await page.getByRole("button", { name: "Cadastrar e gerar link" }).click();
  const confirmationUrl = await page.getByLabel("Link de confirmação").inputValue();
  await page.goto(confirmationUrl);
  await page.getByRole("button", { name: "Simular assinatura e confirmar" }).click();
}

test("payer can choose manual Lightning without NWC", async ({ page }) => {
  await createConfirmedDemoReceivable(page);
  await expect(page.getByRole("heading", { name: "Como você deseja realizar o pagamento?" })).toBeVisible();
  await page.getByRole("button", { name: "Pagar manualmente no vencimento" }).click();
  await expect(page.getByText("Pagamento manual escolhido")).toBeVisible();
  await expect(page.getByText(/invoice Lightning será disponibilizada/i)).toBeVisible();
});

test("payer can activate and revoke a simulated NWC authorization", async ({ page }) => {
  await createConfirmedDemoReceivable(page);
  await page.getByRole("button", { name: "Conectar carteira para pagamento automático" }).click();
  const uri = `nostr+walletconnect://${"1".repeat(64)}?relay=${encodeURIComponent("wss://relay.example.com")}&secret=${"2".repeat(64)}`;
  await page.getByPlaceholder("nostr+walletconnect://…").fill(uri);
  await page.getByRole("button", { name: "Validar e proteger conexão" }).click();
  await expect(page.getByText("Pagamento automático ativo")).toBeVisible();
  await expect(page.getByText(/não é garantido/i)).toBeVisible();
  await page.getByRole("button", { name: "Revogar autorização" }).click();
  await expect(page.getByText(/Nenhum débito automático será solicitado/i)).toBeVisible();
});
