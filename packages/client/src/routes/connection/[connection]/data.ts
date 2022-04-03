import cliConfig from '../../../../../cli_config_old.jsonson'
import { GraphQLClient } from 'graphql-request'
import {getIntrospectionQuery} from 'graphql'

import type {ConnectionConfig} from '$lib/store/connections'
// /** @type {import('@sveltejs/kit').RequestHandler} */
// export async function get({params}) {
//     console.log('finding connection', params)
//     const connection = cliConfig.connections.find(({name}) => name === params.connection)

//     if (!connection) {
//         return {
//             status: 404,
//             headers: {
//                 ['content-type']: 'application/json'
//             },
//             body: 'not found'
//         }
//     }

//     if (connection.introspection) {
//         return {
//             body: connection.introspection,
//             status: 200,
//             headers: {
//                 ['content-type']: 'application/json',
//             }
//         };
//     }


//     return {
//         body: 'bad connection data',
//         status: 400,
//         headers: {
//             ['content-type']: 'application/json',
//         }
//     };
// }

export async function post({request}) {
    const connection: ConnectionConfig = await request.json()

    if (connection.kind !== 'remote') {
        throw new Error('not implemented')
    }

    const graphQLClient = new GraphQLClient(connection.url, { fetch })

    const response = await graphQLClient.request(getIntrospectionQuery())

    const authHeaders = connection.authHeader ? {
        Authorization: connection.authHeader
    } : {}

    return {
        body: response,
        status: 200,
        headers: {
            ['content-type']: 'application/json',
            ...authHeaders
        }
    }
}