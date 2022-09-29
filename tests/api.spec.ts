import { expect, test } from '@playwright/test';

test('GET /api/likes export status code 200', async ({ request }) => {
  const actual = await request.get('/api/likes');

  expect(actual.status()).toBe(200);
});
