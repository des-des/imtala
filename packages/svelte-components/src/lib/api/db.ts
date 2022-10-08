import {
    buildClientSchema,
    getIntrospectionQuery,
    GraphQLEnumType,
    GraphQLInterfaceType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLUnionType,
    type GraphQLType,
    type IntrospectionQuery
} from 'graphql'
import {request as graphqlRequest} from 'graphql-request'


import type { DocumentationProps } from '../components/DocProps'

export interface HttpConnection {
    kind: 'http';
    name: string;
    url: string;
}

export interface GithubOauthConnection {
    kind: 'github-oauth';
    name: string;
    clientId: string;
    clientSecret: string;
    authorisationUrl: string;
    tokenUrl: string;
    graphqlUrl: string;
    audience?: string;
    preFetchedIntrospection?: IntrospectionQuery;
}

export interface StaticIntrospectionConnection {
    kind: 'static-introspection';
    name: 'string';
    introspection: any;
    genDocs?: boolean;
}

// ?? this is wrong
export const isConnection = (connection: any): connection is Connection => {
    if (typeof connection.name !== 'string') return false;

    if (connection.kind === 'github-oauth') return typeof connection.accessToken === 'string'
    if (connection.kind === 'static-introspection') return typeof connection.introspection === 'string'

    return false
}

export type Connection = GithubOauthConnection | StaticIntrospectionConnection | HttpConnection;


interface InitOauth {
    connectionName: string;
    clientId: string;
    clientSecret: string;
    state: string;
    provider: 'github'
}



const getTypeLinkDescription = (type: GraphQLType): string => {
    if (type instanceof GraphQLNonNull) {
        return `${getTypeLinkDescription(type.ofType)}!`
    }

    if (type instanceof GraphQLList) {
        return `[${getTypeLinkDescription(type.ofType)}]`
    }

    return type.name;
}

const getTypeLinkName = (type: GraphQLType): string => {
    if (type instanceof GraphQLNonNull || type instanceof GraphQLList) {
        return getTypeLinkName(type.ofType)
    }

    return type.name;
}

const genDocProps = (introspectionQuery: IntrospectionQuery, connectionName: string, name?: string): DocumentationProps => {
    const schema = buildClientSchema(introspectionQuery)

    if (!name) {
        const queryType = schema.getQueryType()
        const mutationType = schema.getMutationType()
        const subscriptionType = schema.getSubscriptionType()
        const documentationProps: DocumentationProps = {
            title: connectionName,
            pageKind: 'root',
            description: schema.description,
            queryType: queryType && {
                typeName: queryType.name,
                description: getTypeLinkDescription(queryType)
            },
            mutationType: mutationType && {
                typeName: mutationType.name,
                description: getTypeLinkDescription(mutationType)
            },
            subscriptionType: subscriptionType && {
                typeName: subscriptionType.name,
                description: getTypeLinkDescription(subscriptionType)
            }
        }

        return documentationProps
    }

    const type = schema.getType(name)
    const fieldMap = ('getFields' in type) && type?.getFields()
    const fields = fieldMap && Object.keys(fieldMap).map(k => fieldMap[k]).map(field => ({
        typeName: getTypeLinkName(field.type),
        name: field.name,
        typeLinkDescription: getTypeLinkDescription(field.type),
        description: field.description,
        args: ('args' in field) && field.args.map(argType => ({
            description: getTypeLinkDescription(argType.type),
            name: getTypeLinkName(argType.type),
        }))
    }))

    return {
        pageKind: 'type',
        possibleTypes: type instanceof GraphQLUnionType && schema.getPossibleTypes(type).map(possibleType => ({
            typeName: possibleType.name,
            typeDescription: getTypeLinkDescription(possibleType)
        })),
        possibleValues: type instanceof GraphQLEnumType && type.getValues(),
        implementions: type instanceof GraphQLInterfaceType && schema.getPossibleTypes(type).map(possibleType => ({
            typeName: possibleType.name,
            typeDescription: getTypeLinkDescription(possibleType)
        })),
        implements: type instanceof GraphQLObjectType && type.getInterfaces().map(typeInterface => ({
            typeName: typeInterface.name,
            typeDescription: getTypeLinkDescription(typeInterface)
        })),
        name,
        title: name,
        description: type.description,
        fields
    }
}

interface Page {
    query: string;
    connectionName: string;
    name: string;
    pageSettings: any;
}

export const pageStore = (() => {
    let pages: Map<string, Page> | undefined;
    let save: (data: { pages: Map<string, Page>}) => void;

    const createOrUpdatePage = (page: Page) => {
        pages.set(page.name, page)
        save({pages})
    }

    const start = (
        init: () => Map<string, Page>,
        savePages: (data: { pages: Map<string, Page>}) => void
    ) => {
        pages = init();
        save = savePages;
    }

    const getPage = (pageName: string) => pages.get(pageName)

    // const getTypeDocumentation = async (connectionName: string, auth: string, typeName?: string) => {
    //     const introspection = await getIntrospection(connectionName, auth)

    //     return genDocProps(introspection, connectionName, typeName)
    // }

    // const getIntrospectionResponse = async (connectionName: string, auth: string) => {
    //     const connection = connections.get(connectionName)
    //     if (!connection) {
    //         throw new Error('connection does not exist')
    //     }

    //     if (connection.kind === 'static-introspection') {
    //         return connection.introspection;
    //     }

    //     if (connection.kind === 'http') {
    //         return await graphqlRequest(connection.url, getIntrospectionQuery(), {}, auth ? {
    //             authorization: auth
    //         } : {})
    //     }

    //     if (connection.kind === 'github-oauth' && connection.preFetchedIntrospection) {
    //         return connection.preFetchedIntrospection
    //     }

    //     if (connection.kind === 'github-oauth') {
    //         return await graphqlRequest(connection.graphqlUrl, getIntrospectionQuery(), {}, {
    //             authorization: `Bearer ${auth}`
    //         })
    //     }

    // }

    // const getIntrospection = (connectionName: string, auth: string) => {
    //     if (!introspectionStore.has(connectionName)) {
    //         introspectionStore.set(connectionName, getIntrospectionResponse(connectionName, auth))
    //     }

    //     return introspectionStore.get(connectionName)
    // }

    const listPages = () => Array.from(pages.values())

    // const getGenDocsConnectionName = (): string => {
    //     for (const connection of connections.values()) {
    //         if (connection.kind === 'static-introspection' && connection.genDocs) {
    //             return connection.name
    //         }
    //     }
    // }

    return {
        listPages,
        createOrUpdatePage,
        getPage,
        // getIntrospection,
        // getTypeDocumentation,
        // getGenDocsConnectionName,
        start
    }
})();



export const connectionStore = (() => {
    let connections: Map<string, Connection> | undefined;
    let save: (data: { connections: Map<string, Connection>}) => void;
    const introspectionStore = new Map<string, Promise<IntrospectionQuery>>()

    const createOrUpdateConnection = (connection: Connection) => {
        if (connection.kind === 'static-introspection' && connection.genDocs) {
            for (let oldConnection of connections.values()) {
                if (oldConnection.kind === 'static-introspection' && oldConnection.genDocs)

                connections.set(connection.name, {
                    ...oldConnection,
                    genDocs: undefined
                })
            }
        }
        connections.set(connection.name, connection)
        save({connections: connections})
    }

    const start = (
        init: () => Map<string, Connection>,
        saveConnections: (data: { connections: Map<string, Connection>}) => void
    ) => {
        connections = init();
        save = saveConnections;
    }

    const getConnection = (connectionName: string) => connections.get(connectionName)

    const getTypeDocumentation = async (connectionName: string, auth: string, typeName?: string) => {
        const introspection = await getIntrospection(connectionName, auth)

        return genDocProps(introspection, connectionName, typeName)
    }

    const getIntrospectionResponse = async (connectionName: string, auth: string) => {
        const connection = connections.get(connectionName)
        if (!connection) {
            throw new Error('connection does not exist')
        }

        if (connection.kind === 'static-introspection') {
            return connection.introspection;
        }

        if (connection.kind === 'http') {
            return await graphqlRequest(connection.url, getIntrospectionQuery(), {}, auth ? {
                authorization: auth
            } : {})
        }

        if (connection.kind === 'github-oauth' && connection.preFetchedIntrospection) {
            return connection.preFetchedIntrospection
        }

        if (connection.kind === 'github-oauth') {
            return await graphqlRequest(connection.graphqlUrl, getIntrospectionQuery(), {}, {
                authorization: `Bearer ${auth}`
            })
        }

    }

    const getIntrospection = (connectionName: string, auth: string) => {
        if (!introspectionStore.has(connectionName)) {
            introspectionStore.set(connectionName, getIntrospectionResponse(connectionName, auth))
        }

        return introspectionStore.get(connectionName)
    }

    const listConnections = () => Array.from(connections.values())

    const getGenDocsConnectionName = (): string => {
        for (const connection of connections.values()) {
            if (connection.kind === 'static-introspection' && connection.genDocs) {
                return connection.name
            }
        }
    }

    return {
        listConnections,
        createOrUpdateConnection,
        getConnection,
        getIntrospection,
        getTypeDocumentation,
        getGenDocsConnectionName,
        start
    }
})();

export const oauthManager = (() => {
    const oauthApps = new Map<string, InitOauth>()

    const addOauthApp = (init: InitOauth) => {
        oauthApps.set(init.connectionName, init)
    }


    const handleCallback = async (connectionName: string, code: string, state?: string) => {
        const oauthInit = oauthApps.get(connectionName);

        if (!oauthInit) {
            throw new Error('could not find related oauth configuratation')
        }

        if (oauthInit.state && oauthInit.state !== state) {
            throw new Error('state does not match')
        }

        const accessTokenResponse = await fetch(`/connection/${connectionName}/token`, {
            method: 'POST',
            body: JSON.stringify({
                clientId: oauthInit.clientId,
                clientSecret: oauthInit.clientSecret,
                code: code
            }),
            headers: {
                'Accept': 'Application/json'
            }
        })

        const accessTokenResponsePayload = await accessTokenResponse.json();

        return {
            accessToken: accessTokenResponsePayload.access_token
        }
    }

    return {
        addOauthApp,
        handleCallback
    }

})();

