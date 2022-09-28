import type { Like } from '$lib/models/Likes';
import { expect, test } from '@playwright/test';
import 'dotenv/config';
import singleTable from '../src/lib/helpers/dynamodb-single-table.ts';

test('sample test which should be true', async () => {
  const sut = singleTable(process.env.TABLENAME!)('like');
  const actual = await sut.getById<Like>('/posts/firsts');

  expect(actual).toBeTruthy();
});
