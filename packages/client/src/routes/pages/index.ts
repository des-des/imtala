import  {pageStore, type Page} from '@imtala/svelte-components/api/db'
import '$lib/init_db'

export async function post({ request }) {
    const {name, query, connectionName, pageSettings} = await request.json()

    pageStore.createOrUpdatePage({ name, query, connectionName, pageSettings})

    return {
        status: 200,
        headers: {
            ['content-type']: 'application/json',
        },
        body: {
            message: `success`
        }
    }
}