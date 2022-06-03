import getDocumentationProps from '@imtala/svelte-components/api/handlers/documentation/get'

/** @type {import('./index').RequestHandler} */
export async function get({ request, params }) {
    return getDocumentationProps({request, params})
}