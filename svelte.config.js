import { join } from 'path';
import { adapter } from 'sveltekit-adapter-aws';
import preprocess from 'svelte-preprocess';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
export default {
	preprocess: [mdsvex(), preprocess()],
	extensions: ['.svelte', '.svx'],
	kit: {
		csrf: false,
		adapter: adapter({
			autoDeploy: true,
			cdkProjectPath: join(process.cwd(), 'infrastructure/deploy.js')
		})
	}
};
