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
  const result = await data.list<Like>();

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
  const data = singleTable(TABLENAME)('like');

  const existing = await data.get<Like>(id);  
  const updated = { id, value: (existing?.value || 0) + 1 };  
  await data.put<Like>(updated);
}
