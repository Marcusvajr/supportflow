import 'reflect-metadata';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Test } from '@nestjs/testing';
import { readCorsConfig } from '../src/common/cors.config';

test('CORS accepts each configured frontend and excludes untrusted origins over HTTP', async () => {
  const module = await Test.createTestingModule({}).compile();
  const app = module.createNestApplication({ logger: false });
  const allowed = ['https://supportflow-pi.vercel.app', 'https://supportflow-web.onrender.com'];
  app.enableCors(readCorsConfig({ NODE_ENV: 'production', FRONTEND_ORIGIN: ` ${allowed.join(', ')} ` }));
  try {
    await app.listen(0, '127.0.0.1');
    for (const origin of [...allowed, 'https://untrusted.example', `${allowed[0]}.evil.example`, 'null']) {
      const response = await fetch(`${await app.getUrl()}/api/v1/me`, {
        method: 'OPTIONS', headers: { Origin: origin, 'Access-Control-Request-Method': 'GET', 'Access-Control-Request-Headers': 'authorization' },
      });
      assert.equal(response.headers.get('access-control-allow-origin'), allowed.includes(origin) ? origin : null);
      assert.match(response.headers.get('vary') ?? '', /Origin/);
      assert.match(response.headers.get('access-control-allow-headers') ?? '', /authorization/);
    }
  } finally { await app.close(); }
});

test('CORS keeps single-origin compatibility and denies origins by default in production', () => {
  assert.deepEqual(readCorsConfig({ FRONTEND_ORIGIN: 'https://app.example' }).origin, ['https://app.example']);
  assert.deepEqual(readCorsConfig({ NODE_ENV: 'production' }).origin, []);
  assert.deepEqual(readCorsConfig({ FRONTEND_ORIGIN: ' , ' }).origin, []);
  assert.deepEqual(readCorsConfig({}).origin, ['http://localhost:3000']);
});

test('CORS rejects wildcards, credentials, paths and malformed origins without exposing values', () => {
  for (const value of ['*', 'null', 'https://app.example/path', 'https://user:secret@app.example', 'invalid']) {
    assert.throws(() => readCorsConfig({ FRONTEND_ORIGIN: value }), (error: unknown) => {
      assert.equal((error as Error).message, 'FRONTEND_ORIGIN must contain exact HTTP(S) origins.');
      return true;
    });
  }
});
