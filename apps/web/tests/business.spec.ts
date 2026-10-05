import { clerk } from '@clerk/testing/playwright';
import { expect, test, type Page } from '@playwright/test';

// These scenarios use real Clerk, API and persistence. Run only against the
// academic test environment: records intentionally remain as audit evidence.
test.beforeEach(() => {
  if (process.env.E2E_BUSINESS_ENABLED !== 'true') {
    throw new Error('Business E2E requires E2E_BUSINESS_ENABLED=true and a fictitious test environment.');
  }
});

async function signIn(page: Page, role: 'AGENT' | 'SUPERVISOR') {
  const emailAddress = process.env[`E2E_CLERK_${role}_EMAIL`];
  if (!emailAddress) throw new Error(`Missing test account for ${role}.`);
  await page.goto('/');
  await clerk.signIn({ page, emailAddress });
}

async function createTicket(page: Page) {
  await page.goto('/tickets/new');
  const customer = page.getByLabel('Cliente', { exact: true });
  await expect(customer.locator('option')).not.toHaveCount(1);
  await customer.selectOption({ index: 1 });
  await page.getByLabel('Título', { exact: true }).fill(`Teste acadêmico ${Date.now()}`);
  await page.getByLabel('Descrição', { exact: true }).fill('Cliente fictício relata intermitência. Teste automatizado da V3.');
  await page.getByRole('button', { name: 'Criar chamado', exact: true }).click();
  await expect(page).toHaveURL(/\/tickets\/[a-z0-9-]+$/i);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('SF-');
  return new URL(page.url()).pathname;
}

async function diagnoseAndResolve(page: Page) {
  await page.getByRole('button', { name: 'Mover para Em diagnóstico' }).click();
  const composer = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Registrar atividade', exact: true }) });
  await composer.getByLabel('Tipo', { exact: true }).selectOption('DIAGNOSIS');
  await composer.getByLabel('Descrição', { exact: true }).fill('Diagnóstico fictício: enlace instável identificado no teste.');
  await composer.getByRole('button', { name: 'Registrar', exact: true }).click();
  await expect(page.getByText('Diagnóstico mais recente', { exact: true })).toBeVisible();
  await page.getByLabel('Resolução', { exact: true }).fill('Enlace fictício estabilizado e continuidade validada.');
  await page.getByRole('button', { name: 'Concluir atendimento' }).click();
  await expect(page.locator('.ticket-summary .status-resolved')).toBeVisible();
  await page.reload();
  await expect(page.getByText('Enlace fictício estabilizado e continuidade validada.', { exact: true }).first()).toBeVisible();
}

test('flow A persists diagnosis, resolution and technical history', async ({ page }) => {
  await signIn(page, 'AGENT');
  await createTicket(page);
  await diagnoseAndResolve(page);
  await expect(page.getByRole('button', { name: 'Reabrir chamado' })).toHaveCount(0);
});

test('flow B escalates, reassigns and continues with a supervisor', async ({ page, browser }) => {
  await signIn(page, 'AGENT');
  const path = await createTicket(page);
  await page.getByRole('button', { name: 'Mover para Encaminhado' }).click();
  await expect(page.locator('.ticket-summary .status-escalated')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Reatribuir responsável' })).toHaveCount(0);
  const context = await browser.newContext({ baseURL: test.info().project.use.baseURL });
  try {
    const supervisor = await context.newPage();
    await signIn(supervisor, 'SUPERVISOR');
    await supervisor.goto(path);
    const assignee = supervisor.getByLabel('Responsável', { exact: true });
    await expect(assignee).toBeVisible();
    const options = await assignee.locator('option').evaluateAll((nodes) =>
      nodes.map((node) => ({ value: (node as HTMLOptionElement).value, text: node.textContent ?? '' })));
    const target = options.find((option) => option.text.includes('Supervisor'));
    expect(target).toBeDefined();
    await Promise.all([
      supervisor.waitForResponse((response) => response.url().endsWith('/assignee') && response.request().method() === 'PATCH' && response.ok()),
      assignee.selectOption(target!.value),
    ]);
    await expect(assignee).toBeEnabled();
    await diagnoseAndResolve(supervisor);
    await expect(supervisor.getByRole('button', { name: 'Reabrir chamado' })).toBeVisible();
    await supervisor.getByRole('button', { name: 'Reabrir chamado' }).click();
    await expect(supervisor.locator('.ticket-summary .status-diagnosing')).toBeVisible();
    await supervisor.getByLabel('Resolução', { exact: true }).fill('Reabertura fictícia verificada e atendimento encerrado.');
    await supervisor.getByRole('button', { name: 'Concluir atendimento' }).click();
    await expect(supervisor.locator('.ticket-summary .status-resolved')).toBeVisible();
  } finally {
    await context.close();
  }
});
