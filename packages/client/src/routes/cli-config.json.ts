import * as fs from 'fs'
import * as path from 'path'

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get() {
    const cliConfig = JSON.parse(fs.readFileSync(path.resolve('../cli_config.json')).toString())

    return {
        body: cliConfig,
        status: 200,
        headers: {
            ['content-type']: 'application/json',
        }
    };
}
