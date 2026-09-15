import './auth-fixtures';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { HttpException, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '../src/auth/auth.guard';
import { readAuthConfig } from '../src/auth/auth.config';
import { ClerkTokenVerifier } from '../src/auth/clerk-token-verifier';
import { IS_PUBLIC } from '../src/auth/public.decorator';
import type { AuthRequest } from '../src/auth/auth-request';
import { InMemoryUsersRepository, demoUsers } from '../src/users/in-memory-users.repository';
import { UsersService } from '../src/users/users.service';
import { authConfig, executionContext, sessionToken, users } from './auth-fixtures';

const service = new UsersService(new InMemoryUsersRepository(users));
const verifier = new ClerkTokenVerifier(authConfig);

test('Clerk verifier validates a signed session and ignores role claims', async () => {
  assert.deepEqual(await verifier.verify(sessionToken({ role: 'SUPERVISOR' })), { externalAuthId: users[0].externalAuthId });
});

test('Clerk verifier rejects invalid signature, expired/future sessions, wrong issuer/origin and non-session tokens', async () => {
  const token = sessionToken();
  const [header, payload] = token.split('.');
  const invalid = `${header}.${payload}.${Buffer.alloc(256).toString('base64url')}`;
  const now = Math.floor(Date.now() / 1000);
  for (const candidate of [
    'invalid', invalid, sessionToken({ exp: now - 60 }), sessionToken({ nbf: now + 60 }),
    sessionToken({ iss: 'https://other.clerk.accounts.dev' }), sessionToken({ azp: 'https://untrusted.example' }),
    sessionToken({ azp: undefined }), sessionToken({ sub: '' }), sessionToken({ sid: '' }), sessionToken({ sts: 'pending' }),
  ]) {
    await assert.rejects(verifier.verify(candidate), UnauthorizedException);
  }
});

test('missing verifier configuration fails closed', async () => {
  await assert.rejects(new ClerkTokenVerifier({ authorizedParties: [] }).verify(sessionToken()), ServiceUnavailableException);
});

test('auth config derives issuer from public key; production has no implicit allowed origin', () => {
  const key = `pk_test_${Buffer.from('test-instance.clerk.accounts.dev$').toString('base64')}`;
  assert.equal(readAuthConfig({ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: key }).issuer, authConfig.issuer);
  assert.equal(readAuthConfig({ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'invalid' }).issuer, undefined);
  assert.deepEqual(readAuthConfig({ NODE_ENV: 'production' }).authorizedParties, []);
});

test('AuthGuard rejects missing/malformed bearer credentials before verification', async () => {
  let calls = 0;
  const guard = new AuthGuard(new Reflector(), { verify: async () => { calls++; throw new Error('must not verify'); } }, service);
  for (const authorization of [undefined, '', 'Basic a', 'Bearer', 'Bearer ', 'Bearer a b', 'Bearer a,b']) {
    await assert.rejects(guard.canActivate(executionContext({ headers: { authorization } })), UnauthorizedException);
  }
  assert.equal(calls, 0);
});

test('AuthGuard accepts a valid token, uses internal role, and rejects invalid/expired tokens', async () => {
  const guard = new AuthGuard(new Reflector(), verifier, service);
  const request = { headers: { authorization: `Bearer ${sessionToken({ role: 'SUPERVISOR' })}` }, user: users[1] } as AuthRequest;
  assert.equal(await guard.canActivate(executionContext(request)), true);
  assert.equal(request.user?.role, 'AGENT');
  request.headers.authorization = 'Bearer invalid';
  await assert.rejects(guard.canActivate(executionContext(request)), UnauthorizedException);
  assert.equal(request.user, undefined);
  request.headers.authorization = `Bearer ${sessionToken({ exp: 1 })}`;
  await assert.rejects(guard.canActivate(executionContext(request)), UnauthorizedException);
});

test('explicit public handlers do not require a session', async () => {
  const handler = function publicHandler() {};
  Reflect.defineMetadata(IS_PUBLIC, true, handler);
  const guard = new AuthGuard(new Reflector(), verifier, service);
  assert.equal(await guard.canActivate(executionContext({ headers: {} }, handler)), true);
});

test('internal users: active allowed; unknown and inactive denied with 403, without auto-provisioning', async () => {
  assert.deepEqual(await service.resolveActiveUser(users[0].externalAuthId), users[0]);
  for (const id of ['user_unknown', users[2].externalAuthId]) {
    await assert.rejects(service.resolveActiveUser(id), (error: unknown) => error instanceof HttpException && error.getStatus() === 403);
  }
});

test('demo fixture IDs are explicit and duplicate associations are rejected', async () => {
  assert.deepEqual(demoUsers({}), []);
  const fixtures = demoUsers({ DEMO_AGENT_CLERK_ID: 'user_agent', DEMO_INACTIVE_CLERK_ID: 'user_inactive' });
  assert.equal(fixtures.length, 2);
  assert.equal(fixtures[1].active, false);
  assert.throws(() => new InMemoryUsersRepository([users[0], users[0]]), /inválida/);
  const repository = new InMemoryUsersRepository(users);
  const first = await repository.findByExternalAuthId(users[0].externalAuthId);
  assert.notEqual(first, await repository.findByExternalAuthId(users[0].externalAuthId));
});
