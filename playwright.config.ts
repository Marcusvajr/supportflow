import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './apps/web/tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm run dev:web',
      url: 'http://127.0.0.1:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'npm run dev:api',
      url: 'http://127.0.0.1:3001/api/v1/health',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
