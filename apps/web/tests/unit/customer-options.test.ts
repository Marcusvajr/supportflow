import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createApiClient } from '../../src/lib/api-client';
import { loadCustomerOptions } from '../../src/lib/customer-options';

function clientFor(fetcher: typeof fetch) {
  return createApiClient({
    baseUrl: 'https://api.example.test', getToken: async () => 'fixture-only',
    onUnauthorized: () => undefined, onForbidden: () => undefined, fetch: fetcher,
  });
}

test('ticket customer options include customers beyond the first 100 through the authenticated API', async () => {
  const records = Array.from({ length: 205 }, (_, i) => ({ id: `customer-${i}`, name: `Cliente ${i}`, referenceCode: `DEMO-${i}` }));
  const requestedPages: number[] = [];
  const client = clientFor(async (input, init) => {
    const url = new URL(String(input));
    const page = Number(url.searchParams.get('page'));
    requestedPages.push(page);
    assert.equal(url.pathname, '/customers');
    assert.equal(url.searchParams.get('pageSize'), '100');
    assert.equal(new Headers(init?.headers).get('Authorization'), 'Bearer fixture-only');
    return Response.json({ items: records.slice((page - 1) * 100, page * 100), page, pageSize: 100, total: records.length });
  });
  assert.deepEqual(await loadCustomerOptions(client), records);
  assert.deepEqual(requestedPages, [1, 2, 3]);
});

test('empty customer base completes with one request', async () => {
  let calls = 0;
  const result = await loadCustomerOptions(clientFor(async () => {
    calls += 1;
    return Response.json({ items: [], page: 1, pageSize: 100, total: 0 });
  }));
  assert.deepEqual(result, []);
  assert.equal(calls, 1);
});

test('an unavailable later customer page rejects instead of returning an incomplete selector', async () => {
  let calls = 0;
  await assert.rejects(loadCustomerOptions(clientFor(async () => {
    calls += 1;
    if (calls === 2) return new Response(null, { status: 503 });
    return Response.json({ items: [{ id: 'customer-1' }], page: 1, pageSize: 100, total: 2 });
  })));
  assert.equal(calls, 2);
});

test('an empty intermediate customer page fails without an endless request loop', async () => {
  let calls = 0;
  await assert.rejects(loadCustomerOptions(clientFor(async () => {
    calls += 1;
    return Response.json({ items: [], page: 1, pageSize: 100, total: 101 });
  })), /todos os clientes/);
  assert.equal(calls, 1);
});
