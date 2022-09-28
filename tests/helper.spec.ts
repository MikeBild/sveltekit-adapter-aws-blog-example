import type { Like } from '$lib/models/Likes';
import { expect, test } from '@playwright/test';
import 'dotenv/config';
import singleTable from '../src/lib/helpers/dynamodb-single-table.ts';

const sut = singleTable(process.env.TABLENAME!)('like');

test('DynamoDB single table getById expect to be truthy', async () => {
  const actual = await sut.getById<Like>('/posts/first');

  expect(actual).toBeTruthy();
});

test('DynamoDB single table upsert', async () => {
  await sut.upsert({ id: '/posts/demo', value: 5 });
});

test('DynamoDB single table remove', async () => {
  await sut.remove('/posts/demo');
});
