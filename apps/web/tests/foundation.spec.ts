import { expect, test } from '@playwright/test';

test('frontend apresenta o SupportFlow publicado', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /Suporte técnico com contexto do início ao fim/i })).toBeVisible();
  await expect(page.getByText('V3 publicada')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Entrar no SupportFlow' })).toBeVisible();
});

test('backend responde ao health check', async ({ request }) => {
  const response = await request.get('http://127.0.0.1:3001/api/v1/health');

  expect(response.ok()).toBeTruthy();
  await expect(response.json()).resolves.toEqual({
    status: 'ok',
    service: 'supportflow-api',
  });
});
