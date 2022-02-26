import ghApi from '../introspection.json'

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get() {
    return {
        body: ghApi,
        status: 200,
        headers: {
            ['content-type']: 'application/json',
        }
    };
}
