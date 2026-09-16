export const AUTH_CONFIG = Symbol('AUTH_CONFIG');

export type AuthConfig = {
  secretKey?: string;
  jwtKey?: string;
  issuer?: string;
  authorizedParties: string[];
};

export function readAuthConfig(env: NodeJS.ProcessEnv): AuthConfig {
  const key = env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  let issuer = env.CLERK_ISSUER || undefined;
  if (!issuer && key && /^pk_(test|live)_/.test(key)) {
    const host = Buffer.from(key.slice(8), 'base64').toString('utf8');
    if (/^[a-z0-9.-]+\$$/i.test(host)) issuer = `https://${host.slice(0, -1)}`;
  }
  const origins = env.CLERK_AUTHORIZED_PARTIES || env.FRONTEND_ORIGIN
    || (env.NODE_ENV !== 'production' ? 'http://localhost:3000,http://127.0.0.1:3000' : '');
  return {
    secretKey: env.CLERK_SECRET_KEY || undefined,
    jwtKey: env.CLERK_JWT_KEY?.replaceAll(String.raw`\n`, '\n') || undefined,
    issuer,
    authorizedParties: origins.split(',').map((value) => value.trim()).filter(Boolean),
  };
}
