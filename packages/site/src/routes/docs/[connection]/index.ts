import getIntrospection from '@imtala/svelte-components/api/handlers/introspection/get'

/** @type {import('./index').RequestHandler} */
export async function get({ request, params }) {
    return getIntrospection({request, params})
}