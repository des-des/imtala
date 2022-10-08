import getPage from '@imtala/svelte-components/api/handlers/pages/get'
import '$lib/init_db'

/** @type {import('./index').RequestHandler} */
export async function get(...args) {
    return getPage(...args)
}