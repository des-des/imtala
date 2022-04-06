import run from './buildClient.js'

const svelteCommand = process.env.IMTALA_CLIENT_SVELTE_COMMAND || 'build';

const buildMode = process.argv[2];
const introspectionFilePath = process.argv[3]


run({
    svelteCommand,
    buildMode,
    introspectionFilePath
})