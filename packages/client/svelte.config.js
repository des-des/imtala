import staticAdapter from '@sveltejs/adapter-static';
import nodeAdapter from '@sveltejs/adapter-node'
import preprocess from 'svelte-preprocess';

import fs from 'fs'

console.log(process.argv)
const buildMode = process.argv[3] || 'gen-docs';

if (process.argv.length >= 4) {
	const buildMode = process.argv[3];
	const introspectionFilePath = process.argv[4];

	// let cliConfig = {}

	if (buildMode === 'gen-docs') {
		if (!introspectionFilePath) {
			throw new Error('should not generate docs without introspection file')
		}

		const introspectionData = JSON.parse(fs.readFileSync(introspectionFilePath).toString())

		const pathParts = introspectionFilePath.split('/')
		const fileName = pathParts[pathParts.length - 1].split('.json')[0]
		fs.writeFileSync('./cli_config.json', JSON.stringify({
			mode: buildMode,
			docGenIntrospection: fileName,
			connections: [{
				name: fileName,
				kind: 'fs',
				introspection: introspectionData
			}]
		}, null, 4))
	} else if (introspectionFilePath) {
		// const introspectionFilePath = path.join(process.cwd(), introspectionFileRelativePath)
		const introspectionData = JSON.parse(fs.readFileSync(introspectionFilePath).toString())

		const pathParts = introspectionFilePath.split('/')
		const fileName = pathParts[pathParts.length - 1].split('.json')[0]

		fs.writeFileSync('./cli_config.json', JSON.stringify({
			mode: buildMode,
			connections: [{
				name: fileName,
				kind: 'fs',
				introspection: introspectionData
			}]
		}, null, 4))
	} else {
		fs.writeFileSync('./cli_config.json', JSON.stringify({
			mode: buildMode,
			connections: []
		}, null, 4))
	}
}


// todo!!!!

// const fsConnectionConfig = introspectionFileRelativePath) ?
// 	const introspectionFilePath = path.join(process.cwd(), introspectionFileRelativePath)
// 	const introspectionData = fs.readFileSync(introspectionFilePath)

// 	const pathParts = introspectionFilePath.split('/')
// 	const fileName = pathParts[pathParts.length-1].split('.json')[0]
// 	const clConfig = {
// 		mode: buildMode,
// 		connections: introspectionFileRelativePath ? [{
// 			name: fileName,
// 			kind: 'fs',
// 			introspection: introspectionData
// 		}] : []
// 	}

// 	const __dirname = dirname(fileURLToPath(import.meta.url));
// 	fs.writeFileSync(
// 		path.join(__dirname, 'client', 'server', 'entries', 'endpoints', 'cli_config.json'),
// 		introspectionData
// 	)
// }


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
				routes: 'src/docgen-routes'
			}
		}
	}
}

/** @type {import('@sveltejs/kit').Config} */
const config = configs[configName]
// const config = configs['server']


export default config;
