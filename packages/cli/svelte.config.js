import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const cliConfig = require('./cli_config.json')

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		files: {
			routes: cliConfig.docsOnly ? 'src/routes/docs' : 'src/routes'
		}
	}
};

export default config;
