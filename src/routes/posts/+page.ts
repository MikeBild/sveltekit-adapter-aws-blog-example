import type { Likes } from '$lib/models/Likes';
import type { Posts } from '$lib/models/Posts';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, data }) => {
	const request = await fetch('/api/likes');
	const likes: Likes = await request.json();

	return { likes, posts: data as Posts };
};
