/**
 * Verifica apenas o formato das credenciais do Clerk.
 * Não envia chaves à rede nem inclui seus valores em erros.
 */
export function isValidClerkPublishableKey(value: string): boolean {
  const match = /^pk_(test|live)_([A-Za-z0-9+/_-]+={0,2})$/.exec(value);
  if (!match) return false;

  const payload = match[2].replace(/-/g, '+').replace(/_/g, '/');
  const decodedBytes = Buffer.from(payload, 'base64');
  if (!decodedBytes.length) return false;

  // Rejeita valores truncados, concatenados ou com codificação inválida.
  const canonical = decodedBytes.toString('base64').replace(/=+$/, '');
  if (canonical !== payload.replace(/=+$/, '')) return false;

  const decoded = decodedBytes.toString('utf8');
  if (!decoded.endsWith('$')) return false;
  return /^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(decoded.slice(0, -1));
}

export function validateClerkBuildConfig(
  env: { NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?: string; CLERK_SECRET_KEY?: string } = {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  },
): void {
  const publishable = env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secret = env.CLERK_SECRET_KEY;

  // A configuração ausente é permitida para a versão pública sem login.
  // As rotas privadas continuam protegidas no servidor.
  if (!publishable && !secret) return;

  if (!publishable || !isValidClerkPublishableKey(publishable)) {
    throw new Error(
      'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY inválida: use somente a Publishable Key completa copiada do Clerk.',
    );
  }
  if (!secret || !/^sk_(test|live)_[A-Za-z0-9_-]+$/.test(secret)) {
    throw new Error(
      'CLERK_SECRET_KEY ausente ou inválida: configure uma Secret Key somente no ambiente do servidor.',
    );
  }

  const mode = publishable.split('_')[1];
  if (secret.split('_')[1] !== mode) {
    throw new Error('As chaves do Clerk devem pertencer ao mesmo tipo de ambiente (test/live).');
  }
}
