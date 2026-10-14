import 'reflect-metadata';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ServiceUnavailableException } from '@nestjs/common';
import { OpenAiCompatibleSummaryProvider } from '../src/ai/ai-summary.provider';

test('AI request uses a deadline that applies to response body as well', async (t) => {
  const previous = process.env.AI_API_KEY;
  process.env.AI_API_KEY = 'fixture-only';
  t.after(() => {
    if (previous === undefined) delete process.env.AI_API_KEY;
    else process.env.AI_API_KEY = previous;
  });

  const timeout = t.mock.method(AbortSignal, 'timeout', (ms: number) => {
    assert.equal(ms, 60000);
    return new AbortController().signal;
  });
  t.mock.method(globalThis, 'fetch', async (_url: unknown, init: RequestInit) => {
    assert.ok(init.signal instanceof AbortSignal);
    const request = JSON.parse(String(init.body)) as { stream: boolean };
    assert.equal(request.stream, false);
    return Response.json({ choices: [{ message: { content: 'Resumo de teste.' } }] });
  });

  const result = await new OpenAiCompatibleSummaryProvider().generate('Chamado fictício');
  assert.equal(result.text, 'Resumo de teste.');
  assert.equal(timeout.mock.callCount(), 1);
});

test('AI response-body abort is reported as a timeout instead of invalid JSON', async (t) => {
  const previous = process.env.AI_API_KEY;
  process.env.AI_API_KEY = 'fixture-only';
  t.after(() => {
    if (previous === undefined) delete process.env.AI_API_KEY;
    else process.env.AI_API_KEY = previous;
  });

  t.mock.method(globalThis, 'fetch', async () => {
    const response = Response.json({ choices: [] });
    response.json = async () => { throw new DOMException('The operation was aborted', 'AbortError'); };
    return response;
  });
  await assert.rejects(
    new OpenAiCompatibleSummaryProvider().generate('Chamado fictício'),
    (error: unknown) => error instanceof ServiceUnavailableException && /demorou/.test(error.message),
  );
});
