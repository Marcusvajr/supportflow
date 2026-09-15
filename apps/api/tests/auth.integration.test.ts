import './auth-fixtures';
import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { Controller, Get, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { AUTH_CONFIG } from '../src/auth/auth.config';
import { Roles } from '../src/auth/roles.decorator';
import { AccessLogger, type AccessFailure } from '../src/common/access-logger';
import { InMemoryUsersRepository } from '../src/users/in-memory-users.repository';
import { UsersRepository } from '../src/users/users.repository';
import { authConfig, sessionToken, users } from './auth-fixtures';

let supervisorCalls = 0;
@Controller('test-supervisor')
class SupervisorProbe {
  @Get()
  @Roles('SUPERVISOR')
  get() { supervisorCalls++; return { ok: true }; }
}

let app: INestApplication;
let baseUrl: string;
const events: AccessFailure[] = [];
before(async () => {
  const module = await Test.createTestingModule({ imports: [AppModule], controllers: [SupervisorProbe] })
    .overrideProvider(AUTH_CONFIG).useValue(authConfig)
    .overrideProvider(UsersRepository).useValue(new InMemoryUsersRepository(users))
    .overrideProvider(AccessLogger).useValue({ write: (event: AccessFailure) => events.push(event) })
    .compile();
  app = module.createNestApplication({ logger: false });
  app.setGlobalPrefix('api/v1');
  await app.listen(0, '127.0.0.1');
  baseUrl = `${await app.getUrl()}/api/v1`;
});
after(async () => { await app?.close(); });

function get(path: string, token?: string) {
  return fetch(`${baseUrl}${path}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
}

test('HTTP GET /me verifies real signatures and returns only the current internal profile', async () => {
  for (const user of users.slice(0, 2)) {
    const response = await get('/me', sessionToken({ sub: user.externalAuthId }));
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.deepEqual(await response.json(), { id: user.id, name: user.name, email: user.email, role: user.role });
  }
});

test('HTTP missing, invalid and expired sessions return 401 Problem Details', async () => {
  for (const token of [undefined, 'invalid', sessionToken({ exp: 1 })]) {
    const response = await get('/me', token);
    assert.equal(response.status, 401);
    assert.match(response.headers.get('content-type') ?? '', /application\/problem\+json/);
    assert.equal(response.headers.get('www-authenticate'), 'Bearer');
    const body = await response.json();
    assert.equal(body.type, 'authentication_error');
    assert.equal(body.status, 401);
    assert.equal(body.instance, '/api/v1/me');
    assert.equal(body.name, undefined);
  }
});

test('HTTP unknown and inactive users receive the same 403 access-unavailable response', async () => {
  for (const sub of ['user_unknown', users[2].externalAuthId]) {
    const response = await get('/me', sessionToken({ sub }));
    assert.equal(response.status, 403);
    assert.match(response.headers.get('content-type') ?? '', /application\/problem\+json/);
    assert.equal((await response.json()).type, 'authorization_error');
  }
});

test('HTTP role policy rejects an agent even when the signed token claims supervisor', async () => {
  const calls = supervisorCalls;
  const denied = await get('/test-supervisor', sessionToken({ role: 'SUPERVISOR' }));
  assert.equal(denied.status, 403);
  assert.equal(supervisorCalls, calls);
  const allowed = await get('/test-supervisor', sessionToken({ sub: users[1].externalAuthId }));
  assert.equal(allowed.status, 200);
  assert.equal(supervisorCalls, calls + 1);
});

test('HTTP health stays public, including when an invalid bearer token is supplied', async () => {
  for (const token of [undefined, 'invalid']) {
    const response = await get('/health', token);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: 'ok', service: 'supportflow-api' });
  }
});

test('failure logs contain correlation/status but no token, query string or user data', async () => {
  const token = 'secret-marker';
  const response = await get(`/me?token=${token}`, token);
  assert.equal(response.status, 401);
  const event = events.at(-1);
  assert.equal(event?.request_id, response.headers.get('x-request-id'));
  assert.equal(event?.status, 401);
  assert.equal(JSON.stringify(event).includes(token), false);
  assert.equal(JSON.stringify(event).includes('example.test'), false);
  assert.equal((await response.json()).instance, '/api/v1/me');
});
