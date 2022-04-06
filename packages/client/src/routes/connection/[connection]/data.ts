import { GraphQLClient } from 'graphql-request'
import {getIntrospectionQuery} from 'graphql'

import type {ConnectionConfig} from '@imtala/svelte-components/store/connections'

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