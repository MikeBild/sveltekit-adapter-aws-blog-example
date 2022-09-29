import type { Like, Likes } from '$lib/models/Likes';
import type { Posts } from '$lib/models/Posts';
import { TABLENAME } from '$env/static/private';
import singleTable from '../helpers/dynamodb-single-table';

const st = singleTable(TABLENAME)('like');

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
  const result = await st.list<Like>();

  return result.reduce(
    (p, n) => ({
      ...p,
      [n.id]: n.value
    }),
    {}
  );
}

export async function addLike(id: string): Promise<void> {
  const result = await st.get<Like>(id);

  await st.put({
    id,
    value: (result?.value || 0) + 1
  });
}
