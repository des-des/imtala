import cliConfig from '../../cli_config.json'

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
