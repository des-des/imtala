import  {isConnection, connectionStore} from '../../../../../svelte-components/src/lib/api/db'
import '$lib/init_db'

/** @type {import('./callback').RequestHandler} */
export async function get({ request, params }) {
    const {url} = request;
    const {connection: connectionName} = params;

    const code = new URL(url).searchParams.get('code')

    const connection = connectionStore.getConnection(connectionName)

    if (connection.kind === 'github-oauth') {
        const {
            clientId,
            clientSecret
        } = connection

        const accessTokenResponse = await fetch(`https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            }
        })
        const accessTokenResponsePayload = await accessTokenResponse.json();    

        const token = accessTokenResponsePayload.access_token

        return {
            status: 302,
            headers: {
                Location: `/connection/${connection.name}`,
                'set-cookie': [`imtala_${connection.name}=${token}; HttpOnly; Max-Age=${60 * 60 * 24 * 30};`]
            }
        }
    }
}