import { isConnection, connectionStore } from '@imtala/svelte-components/api/db'
import { parse } from 'cookie';

/** @type {import('./index').RequestHandler} */
export async function put({ request, params }) {
    const connection = await request.json()
    const connectionName = params.connectionName
    if (!isConnection(connection)) {
        return {
            status: 400,
            headers: {
                ['content-type']: 'application/json',
            },
            body: {
                error: `must pass a connection as body`
            }
        }
    }

    if (typeof connectionName !== 'string') {
        return {
            status: 400,
            headers: {
                ['content-type']: 'application/json',
            },
            body: {
                error: `missing param in body: 'connectionName'`
            }
        }
    }

    if (!connection) {
        return {
            status: 404,
            headers: {
                ['content-type']: 'application/json',
            },
            body: {
                error: `could not find connection named: '${connectionName}'`
            }
        }
    }

    connectionStore.createOrUpdateConnection(connection)
}

/** @type {import('./index').RequestHandler} */
export async function get({ request, params }) {
    const { connection: connectionName } = params

    if (typeof connectionName !== 'string') {
        return {
            status: 400,
            headers: {
                ['content-type']: 'application/json',
            },
            body: {
                error: `missing param in body: 'connectionName'`
            }
        }
    }

    const connection = connectionStore.getConnection(connectionName)


    if (!connection) {
        return {
            status: 404,
            headers: {
                ['content-type']: 'application/json',
            },
            body: {
                error: `could not find connection named: '${connectionName}'`
            }
        }
    }

    const headers = request.headers;
    const auth = parse(headers.get('cookie'))[`imtala_${connection.name}`]

    if (connection.kind === 'github-oauth' && !auth) {
        return {
            body: {
                connection,
                message: 'missing auth headers',
                clientId: connection.clientId
            },
            status: 200,
            headers: {
                ['content-type']: 'application/json',
            },
            maxage: 60 * 60 * 60
        }
    }

    try {
        const introspection = await connectionStore.getIntrospection(connectionName, auth)
        return {
            body: {
                connection,
                introspection
            },
            status: 200,
            headers: {
                ['content-type']: 'application/json',
            }
        }
    } catch (e) {
        return {
            body: {
                connection,
                message: `Fetching introspection failed with error: '${e.message}'`
            },
            status: 200,
            headers: {
                ['content-type']: 'application/json',
            }
        }
    }

    
}
