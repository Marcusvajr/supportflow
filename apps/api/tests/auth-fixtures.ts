import 'reflect-metadata';
import { generateKeyPairSync, sign } from 'node:crypto';
import type { ExecutionContext } from '@nestjs/common';
import type { AuthConfig } from '../src/auth/auth.config';
import type { User } from '../src/users/user';

export const users: User[] = [
  { id: 'agent', externalAuthId: 'user_test_agent', name: 'Ana Atendente', email: 'ana@example.test', role: 'AGENT', active: true },
  { id: 'supervisor', externalAuthId: 'user_test_supervisor', name: 'Sofia Supervisora', email: 'sofia@example.test', role: 'SUPERVISOR', active: true },
  { id: 'inactive', externalAuthId: 'user_test_inactive', name: 'Igor Inativo', email: 'igor@example.test', role: 'AGENT', active: false },
];

const keys = generateKeyPairSync('rsa', { modulusLength: 2048 });
export const authConfig: AuthConfig = {
  jwtKey: keys.publicKey.export({ type: 'spki', format: 'pem' }).toString(),
  issuer: 'https://test-instance.clerk.accounts.dev',
  authorizedParties: ['http://localhost:3000'],
};

export function sessionToken(claims: Record<string, unknown> = {}): string {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT', kid: 'test-key' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: authConfig.issuer, azp: authConfig.authorizedParties[0], sub: users[0].externalAuthId,
    sid: 'sess_test', iat: now, nbf: now - 5, exp: now + 60, ...claims,
  })).toString('base64url');
  const input = `${header}.${payload}`;
  return `${input}.${sign('RSA-SHA256', Buffer.from(input), keys.privateKey).toString('base64url')}`;
}

export function executionContext(request: object, handler = function handler() {}, controller = class Controller {}): ExecutionContext {
  return {
    getHandler: () => handler,
    getClass: () => controller,
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}
