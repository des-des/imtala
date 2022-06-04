import getDocumentationProps from '@imtala/svelte-components/api/handlers/documentation/get'
import '$lib/init_db'

/** @type {import('./index').RequestHandler} */
export async function get({ request, params }) {
    return getDocumentationProps({request, params})
}