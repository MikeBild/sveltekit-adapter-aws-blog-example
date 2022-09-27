import { addLike, getLikes } from '$lib/data';
import { json, error, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  return json(await getLikes());
};

export const PUT: RequestHandler = async ({ request }) => {
  const { id } = await request.json();
  if (!id) return error(404, new Error('post id missing'));
  await addLike(id);

  return json({ id });
};
