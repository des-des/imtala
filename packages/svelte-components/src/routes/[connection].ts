import getIntrospection from '$lib/api/handlers/introspection/get'

export async function get({ request, params }) {
    return getIntrospection({request, params})
}