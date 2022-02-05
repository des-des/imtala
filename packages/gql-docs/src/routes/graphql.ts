import ghApi from './github_introspection.json'

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post() {
    return {
        body: ghApi,
        status: 200,
        headers: {
            ['content-type']: 'application/json',
        }
    };
}
