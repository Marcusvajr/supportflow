import { test as setup } from '@playwright/test';
import { clerkSetup } from '@clerk/testing/playwright';

setup('preparar testes reais do Clerk', async () => {
  const required = [
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', 'CLERK_SECRET_KEY',
    'DEMO_AGENT_CLERK_ID', 'DEMO_INACTIVE_CLERK_ID',
    'E2E_CLERK_AGENT_EMAIL', 'E2E_CLERK_AGENT_PASSWORD',
    'E2E_CLERK_INACTIVE_EMAIL', 'E2E_CLERK_INACTIVE_PASSWORD',
  ];
  const missing = required.filter((name) => !process.env[name]?.trim());
  if (missing.length) {
    throw new Error(`Configure no .env as variáveis de teste: ${missing.join(', ')}. Consulte docs/auth-clerk.md.`);
  }
  if (!process.env.CLERK_SECRET_KEY?.startsWith('sk_test_')) {
    throw new Error('Os testes de autenticação exigem uma instância Clerk de desenvolvimento.');
  }
  process.env.CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  try {
    await clerkSetup();
  } catch {
    throw new Error('Não foi possível preparar o Clerk. Confira as chaves de desenvolvimento e a conexão.');
  }
});
