import  {isConnection, connectionStore} from '@imtala/svelte-components/api/db'
import '$lib/init_db'

export async function get() {
    return {
        body: {
            connections: connectionStore.listConnections(),
        },
        status: 200,
        headers: {
            ['content-type']: 'application/json',
        }
    }
}