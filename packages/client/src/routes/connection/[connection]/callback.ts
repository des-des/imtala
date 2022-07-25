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
            clientSecret,
            tokenUrl,
            name
        } = connection

        const accessTokenResponse = await fetch(`${tokenUrl}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                ['Content-Type']: 'application/json'
            },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                code: code,
                response_type: 'code',
                grant_type: 'authorization_code',
                redirect_uri: `http://localhost:3000/connection/${name}/callback`
            })
        })
        const accessTokenResponsePayload = await accessTokenResponse.json();

        console.log({accessTokenResponsePayload})

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