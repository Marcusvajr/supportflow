import { expect, test } from '@playwright/test';

test('frontend exibe a fundação do SupportFlow', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'SupportFlow' })).toBeVisible();
  await expect(page.getByText('Change 01 — Project Foundation')).toBeVisible();
});

test('backend responde ao health check', async ({ request }) => {
  const response = await request.get('http://127.0.0.1:3001/api/v1/health');

  expect(response.ok()).toBeTruthy();
  await expect(response.json()).resolves.toEqual({
    status: 'ok',
    service: 'supportflow-api',
  });
});
