import {connectionStore, pageStore} from '../../db'
import { parse } from 'cookie';
import {request as graphqlRequest} from 'graphql-request'

const getPage = async ({request, params}: {request: any, params: any}) => {
    const { page: pageName } = params

    if (typeof pageName !== 'string') {
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

    const page = pageStore.getPage(pageName)

    if (!page) {
        return {
            status: 404,
            headers: {
                ['content-type']: 'application/json',
            },
            body: {
                error: `could not find connection named: '${pageName}'`
            }
        }
    }

    const connectionName = page.connectionName
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
    const token = parse(headers.get('cookie'))[`imtala_${connection.name}`]

    if (connection.kind === 'github-oauth' && !token) {
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

    // try {
    //     const introspection = await connectionStore.getIntrospection(connectionName, auth)
    //     return {
    //         body: {
    //             connection,
    //             introspection
    //         },
    //         status: 200,
    //         headers: {
    //             ['content-type']: 'application/json',
    //         }
    //     }
    // } catch (e) {
    //     console.error(e)
    //     return {
    //         body: {
    //             connection,
    //             message: `Fetching introspection failed with error: '${e.message}'`
    //         },
    //         status: 200,
    //         headers: {
    //             ['content-type']: 'application/json',
    //         }
    //     }
    // }

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

    const response = await graphqlRequest(connection.graphqlUrl, page.query, {}, {
        authorization: `Bearer ${token}`
    })


    return {
        body: {
            response,
            page,
            connection
        },
        status: response.status,
        headers: response.headers
    }
}

export default getPage;