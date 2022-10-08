import {connectionStore} from '../../db'
import { parse } from 'cookie';
import {request as graphqlRequest} from 'graphql-request'

const runQuery = async ({request, params}: {request: any, params: any}) => {
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
            status: 400,
            headers: {
                ['content-type']: 'application/json',
            },
            body: {
                error: `cannot execute gql query against static connection`
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
                clientId: 'clientId' in connection && connection.clientId
            },
            status: 200,
            headers: {
                ['content-type']: 'application/json',
            }
        }
    }


    if (connection.kind === 'http') {
        return {
            body: {
                connection,
                message: 'graphql queries not supported http connection type',
            },
            status: 501,
            headers: {
                ['content-type']: 'application/json',
            }
        }
    }

    const response = await graphqlRequest(connection.graphqlUrl, await request.text(), {}, {
        authorization: `Bearer ${token}`
    })

    return {
        body: response,
        status: response.status,
        headers: response.headers
    }
}

export default runQuery;