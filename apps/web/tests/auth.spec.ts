import { clerk } from '@clerk/testing/playwright';
import { expect, test, type Page } from '@playwright/test';

async function signIn(page: Page, kind: 'AGENT' | 'INACTIVE') {
  await page.goto('/');

  await clerk.signIn({
    page,
    emailAddress: process.env[`E2E_CLERK_${kind}_EMAIL`]!,
  });

  await page.goto('/dashboard');
}

test('login vÃ¡lido retorna ao dashboard, consulta /me e permite logout', async ({ page }) => {
  await signIn(page, 'AGENT');
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText(/Seu acesso est.* ativo/i)).toBeVisible();
  await expect(page.getByRole('heading', { name: /Ana Atendente/i })).toBeVisible();
  await page.getByRole('button', { name: 'Sair da conta' }).click();
  await expect(page).toHaveURL(/\/sign-in/);
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/sign-in/);
});

test('usuÃ¡rio autenticado inativo recebe acesso indisponÃ­vel', async ({ page }) => {
  await signIn(page, 'INACTIVE');
  await expect(page).toHaveURL(/\/access-unavailable$/);
  await expect(page.getByRole('heading', { name: /Acesso indispon.*vel/i })).toBeVisible();
  await expect(page.getByText(/Seu acesso est.* ativo/i)).toHaveCount(0);
  await page.getByRole('button', { name: 'Sair da conta' }).click();
  await expect(page).toHaveURL(/\/sign-in/);
});

test('401 da API apÃ³s expiraÃ§Ã£o encerra a sessÃ£o e retorna ao login', async ({ page }) => {
  await signIn(page, 'AGENT');
  await expect(page.getByText(/Seu acesso est.* ativo/i)).toBeVisible();
  await page.route('**/api/v1/me', (route) => route.fulfill({
    status: 401, contentType: 'application/problem+json',
    body: JSON.stringify({ type: 'authentication_error', title: 'NÃ£o autenticado', status: 401, instance: '/api/v1/me' }),
  }));
  await page.reload();
  await expect(page).toHaveURL(/\/sign-in/);
  await expect(page.getByText(/Seu acesso est.* ativo/i)).toHaveCount(0);
});




