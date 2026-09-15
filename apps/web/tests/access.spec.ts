import { expect, test } from '@playwright/test';

test('visitante é redirecionado de uma rota privada para o login', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/sign-in/);
  await expect(page.getByRole('heading', { name: 'Acesse sua central de suporte' })).toBeVisible();
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    await expect(page.getByLabel('Email address', { exact: true })).toBeVisible();
  } else {
    await expect(page.getByRole('heading', { name: 'Autenticação indisponível' })).toBeVisible();
  }
  await expect(page.getByText('Seu acesso está ativo')).toHaveCount(0);
});

test('health do frontend é público', async ({ request }) => {
  const response = await request.get('/api/health');
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ status: 'ok', service: 'supportflow-web' });
});
