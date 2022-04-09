import * as fs from 'fs'
import * as path from 'path'

import cliConfig from '../cli_config'
/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get() {

    return {
        body: cliConfig,
        status: 200,
        headers: {
            ['content-type']: 'application/json',
        }
    };
}
