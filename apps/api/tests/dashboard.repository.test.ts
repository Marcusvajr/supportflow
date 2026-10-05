import 'reflect-metadata';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { SupabaseTicketsRepository } from '../src/tickets/supabase-tickets.repository';

test('dashboard uses exact server counts beyond the Data API row limit and excludes resolved priorities', async (t) => {
  const saved = { ...process.env };
  process.env.SUPABASE_URL = 'https://example.test';
  process.env.SUPABASE_PUBLISHABLE_KEY = 'fixture-public';
  process.env.SUPABASE_BACKEND_KEY = 'fixture-backend';
  t.after(() => { process.env = saved; });
  const counts: Record<string, number> = {
    'all': 2501, 'eq.OPEN': 1200, 'eq.DIAGNOSING': 800,
    'eq.ESCALATED': 200, 'eq.RESOLVED': 301, 'eq.CRITICAL': 17, 'eq.HIGH': 83,
  };
  let requests = 0;
  t.mock.method(globalThis, 'fetch', async (input: string, init: RequestInit) => {
    requests++;
    const url = new URL(input);
    const headers = new Headers(init.headers);
    assert.equal(headers.get('Prefer'), 'count=exact');
    if (init.method !== 'HEAD') {
      assert.equal(url.searchParams.get('limit'), '5');
      return new Response('[]', { headers: { 'content-range': '*/2501' } });
    }
    const priority = url.searchParams.get('priority');
    if (priority) assert.equal(url.searchParams.get('status'), 'neq.RESOLVED');
    const count = counts[priority ?? url.searchParams.get('status') ?? 'all'];
    assert.notEqual(count, undefined);
    return new Response(null, { headers: { 'content-range': `*/${count}` } });
  });
  assert.deepEqual(await new SupabaseTicketsRepository().summary(), {
    total: 2501, open: 1200, diagnosing: 800, escalated: 200, resolved: 301,
    criticalActive: 17, highActive: 83, recent: [],
  });
  assert.equal(requests, 8);
});

test('dashboard fails safely when exact counts are unavailable', async (t) => {
  const saved = { ...process.env };
  process.env.SUPABASE_URL = 'https://example.test';
  process.env.SUPABASE_PUBLISHABLE_KEY = 'fixture-public';
  process.env.SUPABASE_BACKEND_KEY = 'fixture-backend';
  t.after(() => { process.env = saved; });
  t.mock.method(globalThis, 'fetch', async () => new Response('[]'));
  await assert.rejects(new SupabaseTicketsRepository().summary(), /temporariamente indisponível/);
});
