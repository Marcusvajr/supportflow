import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ApiError, createApiClient } from '../../src/lib/api-client';

test('API client obtains a fresh token per call, sends bearer and disables caching/cookie forwarding', async () => {
  let calls = 0;
  const client = createApiClient({
    baseUrl: 'https://api.example.test/api/v1/',
    getToken: async () => `token-${++calls}`,
    onUnauthorized: () => assert.fail('unexpected unauthorized'),
    onForbidden: () => assert.fail('unexpected forbidden'),
    fetch: async (url, init) => {
      assert.equal(url, 'https://api.example.test/api/v1/me');
      assert.equal(new Headers(init?.headers).get('Authorization'), `Bearer token-${calls}`);
      assert.equal(init?.cache, 'no-store');
      assert.equal(init?.credentials, 'omit');
      assert.equal(init?.redirect, 'error');
      return Response.json({ id: 'agent', role: 'AGENT' });
    },
  });
  assert.deepEqual(await client.request('/me'), { id: 'agent', role: 'AGENT' });
  await client.request('/me', { headers: { Authorization: 'untrusted' }, credentials: 'include' });
  assert.equal(calls, 2);
});

test('API client sends 401 to login and 403 to the access-unavailable handler', async () => {
  for (const status of [401, 403, 503]) {
    const actions: string[] = [];
    const client = createApiClient({
      baseUrl: 'https://api.example.test/api/v1', getToken: async () => 'token',
      onUnauthorized: () => { actions.push('login'); },
      onForbidden: () => { actions.push('access-unavailable'); },
      fetch: async () => Response.json({ status }, { status }),
    });
    await assert.rejects(client.request('/me'), (error: unknown) => error instanceof ApiError && error.status === status);
    assert.deepEqual(actions, status === 401 ? ['login'] : status === 403 ? ['access-unavailable'] : []);
  }
});

test('missing session token redirects without sending an unauthenticated request', async () => {
  let redirected = false;
  const client = createApiClient({
    baseUrl: 'https://api.example.test', getToken: async () => null,
    onUnauthorized: () => { redirected = true; }, onForbidden: () => {},
    fetch: async () => assert.fail('must not call backend'),
  });
  await assert.rejects(client.request('/me'), ApiError);
  assert.equal(redirected, true);
});

test('client rejects external URLs and propagates network failure without changing authentication', async () => {
  const client = createApiClient({
    baseUrl: 'https://api.example.test', getToken: async () => 'token',
    onUnauthorized: () => assert.fail('network error is not expired auth'), onForbidden: () => assert.fail('network error is not forbidden'),
    fetch: async () => { throw new TypeError('network unavailable'); },
  });
  for (const path of ['https://untrusted.example', '//untrusted.example', '/\\untrusted.example']) {
    await assert.rejects(client.request(path), /relativo à API/);
  }
  await assert.rejects(client.request('/me'), TypeError);
});
