import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AccessLogger, type AccessEvent } from '../src/common/access-logger';
import { RequestContextMiddleware } from '../src/common/request-context.middleware';

test('access logger emits structured correlation data without request payloads', () => {
  const writes: string[] = [];
  const original = process.stdout.write.bind(process.stdout);
  const stdout = process.stdout as typeof process.stdout & { write: typeof process.stdout.write };
  stdout.write = ((chunk: string | Uint8Array) => { writes.push(String(chunk)); return true; }) as typeof process.stdout.write;
  try {
    const logger = new AccessLogger();
    const event: AccessEvent = {
      request_id: 'req-12345678',
      trace_id: 'a'.repeat(32),
      route: '/api/v1/tickets',
      method: 'GET',
      status: 200,
      duration_ms: 4.2,
    };
    logger.write(event);
    const parsed = JSON.parse(writes.join('').trim()) as Record<string, unknown>;
    assert.equal(parsed.request_id, event.request_id);
    assert.equal(parsed.trace_id, event.trace_id);
    assert.equal(parsed.status, 200);
    assert.equal(parsed.event, 'http_request_completed');
    assert.equal('headers' in parsed, false);
  } finally {
    stdout.write = original;
  }
});

test('request context middleware creates correlation headers', () => {
  const events: AccessEvent[] = [];
  const middleware = new RequestContextMiddleware({ write: (event: AccessEvent) => events.push(event) } as AccessLogger);
  const finishHandlers: Array<() => void> = [];
  const headers = new Map<string, string>();
  const request = {
    path: '/api/v1/health',
    method: 'GET',
    header: () => undefined,
  };
  const response = {
    statusCode: 200,
    setHeader: (key: string, value: string) => headers.set(key.toLowerCase(), value),
    once: (event: string, callback: () => void) => { if (event === 'finish') finishHandlers.push(callback); },
  };
  let nextCalled = false;
  middleware.use(request as never, response as never, () => { nextCalled = true; });
  assert.equal(nextCalled, true);
  assert.match(headers.get('x-request-id') ?? '', /^[0-9a-f-]{36}$/);
  assert.match(headers.get('traceparent') ?? '', /^00-[0-9a-f]{32}-[0-9a-f]{16}-01$/);
  finishHandlers.forEach((handler) => handler());
  assert.equal(events.length, 1);
  assert.equal(events[0].status, 200);
});
