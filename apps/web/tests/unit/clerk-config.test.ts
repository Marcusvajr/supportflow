import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isValidClerkPublishableKey, validateClerkBuildConfig } from '../../src/lib/clerk-config';

const testPublic = `pk_test_${Buffer.from('demo.clerk.accounts.dev$').toString('base64')}`;
const livePublic = `pk_live_${Buffer.from('login.example.com$').toString('base64')}`;

test('accepts complete Clerk publishable keys', () => {
  assert.equal(isValidClerkPublishableKey(testPublic), true);
  assert.equal(isValidClerkPublishableKey(livePublic), true);
});

test('rejects copied .env blocks, secret keys and malformed values', () => {
  const invalid = [
    'pk_test_', 'sk_test_secret', 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=' + testPublic,
    testPublic + '\nCLERK_SECRET_KEY=sk_test_exposed',
    testPublic + ' ', 'pk_test_invalid', 'pk_test_YWJjZA==',
  ];
  for (const value of invalid) assert.equal(isValidClerkPublishableKey(value), false);
});

test('allows deliberately disabled Clerk and accepts paired keys', () => {
  assert.doesNotThrow(() => validateClerkBuildConfig({}));
  assert.doesNotThrow(() => validateClerkBuildConfig({
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: testPublic,
    CLERK_SECRET_KEY: 'sk_test_placeholder',
  }));
  assert.doesNotThrow(() => validateClerkBuildConfig({
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: livePublic,
    CLERK_SECRET_KEY: 'sk_live_placeholder',
  }));
});

test('rejects missing or mismatched credentials without leaking key values', () => {
  for (const env of [
    { NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: testPublic },
    { CLERK_SECRET_KEY: 'sk_test_placeholder' },
    { NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: testPublic, CLERK_SECRET_KEY: 'sk_live_placeholder' },
    { NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'pk_test_invalid', CLERK_SECRET_KEY: 'sk_test_placeholder' },
  ]) {
    assert.throws(() => validateClerkBuildConfig(env), (error: unknown) => {
      assert.equal(error instanceof Error, true);
      assert.equal((error as Error).message.includes('sk_test_placeholder'), false);
      assert.equal((error as Error).message.includes(testPublic), false);
      return true;
    });
  }
});
