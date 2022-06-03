import * as fs from 'fs'
import * as path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import {connectionStore} from '@imtala/svelte-components/api/db'


export const createCliConfig = (buildMode, introspectionFilePath) => {
    const resolvedIntrospectionFilePath = introspectionFilePath && path.resolve(introspectionFilePath)
    const introspectionFileName = resolvedIntrospectionFilePath && resolvedIntrospectionFilePath.split('/').reverse()[0].split('.json')[0]
    const introspectionData = resolvedIntrospectionFilePath && JSON.parse(fs.readFileSync(resolvedIntrospectionFilePath).toString())

    const connections = introspectionData ? [{
        name: introspectionFileName,
        kind: 'fs',
        introspection: introspectionData
    }] : []

    return buildMode === 'documentation' ? {
        connections,
        buildMode,
        docGenIntrospection: introspectionFileName
    } : {
        connections
    }
}

const run = async ({
    svelteCommand,
    buildMode,
    introspectionFilePath
}) => {
    return new Promise(res => {
        // const svelteCommand = process.env.IMTALA_CLIENT_SVELTE_COMMAND || 'build';

        // const buildMode = process.argv[2];
        // const introspectionFilePath = process.argv[3]

        if (buildMode !== 'client' && buildMode !== 'documentation') {
            throw new Error('No build mode')
        }

        const __dirname = dirname(fileURLToPath(import.meta.url));



        // const configAsTypescript = `export default ${JSON.stringify(createCliConfig(buildMode, introspectionFilePath), null, 4)}`
        if (introspectionFilePath) {
            const resolvedIntrospectionFilePath = path.resolve(introspectionFilePath)
            const introspectionFileName = resolvedIntrospectionFilePath.split('/').reverse()[0].split('.json')[0]
            const introspectionData = JSON.parse(fs.readFileSync(resolvedIntrospectionFilePath).toString())
    
            connectionStore.createOrUpdateConnection({
                name: introspectionFileName,
                introspection: introspectionData.data,
                kind: 'static-introspection',
                genDocs: true
            })
        }

        // fs.writeFileSync(
        //     path.resolve(__dirname, '..', 'src', 'cli_config.ts'),
        //     configAsTypescript
        // )

        fs.writeFileSync(
            path.resolve(__dirname, '..', 'svelte.config.js'),
            fs.readFileSync(path.resolve(__dirname, '..', `${buildMode}.svelte.config.js`))
        )


        const svelteProcess = spawn("npm", ['run', svelteCommand], {
            cwd: path.resolve(__dirname, '..'),
            stdio: [process.stdin, process.stdout, process.stderr]
        })

        svelteProcess.on('close', (code) => {

            res({outputDirectory: path.resolve(__dirname, '..', 'build')})
        });

        process.on('exit', () => {
            svelteProcess.kill();
        })
    })

}

export default run;

