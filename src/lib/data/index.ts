import type { Likes, Like } from '$lib/models/Likes';
import type { Posts } from '$lib/models/Posts';
import singleTable from '../helpers/dynamodb-single-table';
import { TABLENAME } from '$env/static/private';

export async function getPosts() {
  const data = Object.entries(import.meta.glob('../../routes/posts/**/*.svx', { eager: true }));

  return data.reduce(
    (previous, [url, obj]: [string, any]) => ({
      ...previous,
      [url.replace('../../routes', '').replace('/+page.svx', '')]: obj.metadata
    }),
    {} as Posts
  );
}

export async function getLikes(): Promise<Likes> {
  const data = singleTable(TABLENAME)('like');
  const result = await data.listAll<Like>();

  return (
    result.reduce(
      (p, n) => ({
        ...p,
        [n.id]: n.value
      }),
      {}
    ) || {}
  );
}


export async function addLike(id: string): Promise<void> {
  const result = await ddb
    .getItem({
      TableName: TABLENAME,
      ConsistentRead: true,
      Key: DynamoDB.Converter.marshall({
        id,
        datatype: 'like'
      })
    })
    .promise();

  const likeToUpdate = result.Item && DynamoDB.Converter.unmarshall(result.Item);

  await ddb
    .putItem({
      TableName: TABLENAME,
      Item: DynamoDB.Converter.marshall({
        id,
        datatype: 'like',
        value: likeToUpdate?.value ? likeToUpdate.value + 1 : 1
      })
    })
    .promise();
}
