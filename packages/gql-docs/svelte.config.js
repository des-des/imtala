// import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';
import { mdsvex } from 'mdsvex';

const mdsvexConfig = {
	extensions: ['.md'],

	smartypants: {
		dashes: 'oldschool'
	},

	remarkPlugins: [],
	rehypePlugins: []
};



/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', ...mdsvexConfig.extensions],

	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	// preprocess: preprocess(),
	preprocess: [preprocess(), mdsvex(mdsvexConfig)],


	kit: {
		adapter: adapter({
			precompress: true,
		}),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',

		vite: {
			server: {
				fs: {
					allow: ['README.md']
				}
			}
		}
	}
};

export default config;



// import adapter from '@sveltejs/adapter-static';
// // import adapter from '@sveltejs/adapter-auto';
// import preprocess from 'svelte-preprocess';
// // import svelte from 'rollup-plugin-svelte'
// import { mdsvex } from 'mdsvex';

// const mdsvexConfig = {
// 	extensions: ['.md'],

// 	smartypants: {
// 		dashes: 'oldschool'
// 	},

// 	remarkPlugins: [],
// 	rehypePlugins: []
// };

// /** @type {import('@sveltejs/kit').Config} */
// const config = {
// 	extensions: ['.svelte', ...mdsvexConfig.extensions],
// 	// Consult https://github.com/sveltejs/svelte-preprocess
// 	// for more information about preprocessors
// 	preprocess: [preprocess(), mdsvex(mdsvexConfig)],
// 	kit: {
// 		paths: {
// 			assets: 'https://des-des.github.io/imtala',
// 			base: '/imtala'
// 		},
// 		adapter: adapter(),

// 		// hydrate the <div id="svelte"> element in src/app.html
// 		target: '#svelte'
// 	}
// };

// export default config;
