import runQuery from '@imtala/svelte-components/api/handlers/graphql/get'
import '$lib/init_db'

/** @type {import('./index').RequestHandler} */
export async function post(...args) {
    return runQuery(...args)
}