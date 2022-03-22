import staticAdapter from '@sveltejs/adapter-static';
import nodeAdapter from '@sveltejs/adapter-node'
import preprocess from 'svelte-preprocess';
import { createRequire } from "module";
const require = createRequire(import.meta.url);

import fs from 'fs'

const buildMode = fs.readFileSync('.build_mode').toString().trim()

const configName = buildMode === 'server' ? 'server' : 'gen-docs'

const configs = {
	server: {
		preprocess: preprocess(),
	
		kit: {
			adapter: nodeAdapter({
				out: 'client'
			}),
		}
	},
	['gen-docs']: {
		preprocess: preprocess(),
	
		kit: {
			adapter: staticAdapter({
				out: 'docs'
			}),
			files: {
				routes: 'src/routes/docs'
			}
		}
	}
}

/** @type {import('@sveltejs/kit').Config} */
const config = configs[configName]

console.log(config)

export default config;
