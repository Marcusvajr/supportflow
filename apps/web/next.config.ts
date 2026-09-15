import type { NextConfig } from 'next';
import { loadEnvFile } from 'node:process';
import { resolve } from 'node:path';

// npm executa o workspace em apps/web; o ambiente local fica na raiz do monorepo.
// Não usar `env` do NextConfig: ele poderia incluir segredos nos bundles.
try {
  loadEnvFile(resolve(process.cwd(), '../../.env'));
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
}

const nextConfig: NextConfig = {};
export default nextConfig;
