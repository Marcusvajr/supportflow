import assert from 'node:assert/strict';
import { test } from 'node:test';
import { HealthController } from '../src/health/health.controller';

test('health controller reports a healthy SupportFlow API', () => {
  const controller = new HealthController();

  assert.deepEqual(controller.check(), {
    status: 'ok',
    service: 'supportflow-api',
  });
});
