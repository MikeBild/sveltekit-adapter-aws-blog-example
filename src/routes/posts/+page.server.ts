import { getPosts } from '$lib/data';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = getPosts;
