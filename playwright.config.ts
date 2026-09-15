import { defineConfig, devices } from '@playwright/test';
import { loadEnvFile } from 'node:process';

try {
  loadEnvFile('.env');
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
}

export default defineConfig({
  testDir: './apps/web/tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    // Traces de login podem conter cookies e Bearer tokens reais.
    trace: 'off',
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: '**/auth.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    { name: 'clerk-setup', testMatch: '**/clerk.setup.ts' },
    {
      name: 'chromium-auth',
      testMatch: '**/auth.spec.ts',
      dependencies: ['clerk-setup'],
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm run dev:web',
      url: 'http://localhost:3000/api/health',
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
