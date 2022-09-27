import { expect, test } from '@playwright/test';

test('GET /api/likes export status code 200', async ({ request }) => {
  const expected = await request.get('/api/likes');

  expect(expected.status()).toBe(200);
});
