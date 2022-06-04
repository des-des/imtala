import  {connectionStore, type Connection} from '@imtala/svelte-components/api/db'
import '$lib/init_db'

export async function post({ request }) {
    const {connection, auth} = await request.json()

    connectionStore.createOrUpdateConnection(connection)

    const cookie = (connection as Connection).kind === 'http' && auth ? {
        'set-cookie': [`imtala_${connection.name}=${auth}; HttpOnly; Max-Age=${60 * 60 * 24 * 30};`]
    } : {}
 
    return {
        status: 200,
        headers: {
            ['content-type']: 'application/json',
            ...cookie
        },
        body: {
            message: `success`
        }
    }
}