import {connectionStore} from '../../db'
import { parse } from 'cookie';

const getIntrospection = async ({request, params}: {request: any, params: any}) => {
    const {connection: connectionName} = params

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

    if (connection.kind === 'static-introspection') {
        return {
            body: {
                introspection: connection.introspection,
                connection
            },
            status: 200,
            headers: {
                ['content-type']: 'application/json',
            }
        }
    }

    if (connection.preFetchedIntrospection) {
        return {
            body: {
                introspection: connection.preFetchedIntrospection,
                connection
            },
            status: 200,
            headers: {
                ['content-type']: 'application/json',
            }
        }
    }

    const headers = request.headers;
    const token = parse(headers.get('cookie'))[`imtala_${connection.name}`]

    if (!token) {
        return {
            body: {
                connection,
                message: 'missing auth cookie',
                clientId: connection.clientId
            },
            status: 200,
            headers: {
                ['content-type']: 'application/json',
            }
        }
    }

    const introspection = await connectionStore.getIntrospection(connectionName, token)

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
}

export default getIntrospection;