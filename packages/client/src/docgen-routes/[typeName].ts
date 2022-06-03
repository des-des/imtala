import getDocumentationProps from '@imtala/svelte-components/api/handlers/documentation/get'
import {connectionStore} from '@imtala/svelte-components/api/db'

/** @type {import('./index').RequestHandler} */
export async function get({ request, params }) {
    const connection = connectionStore.getGenDocsConnectionName()
    return getDocumentationProps({request, params: {...params, connection}})
}