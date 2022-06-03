import { writable } from 'svelte/store'

type Fetch = (info: RequestInfo, init?: RequestInit) => Promise<Response>

interface CommonConnectionConfig {
    name: string;
    storage: 'server' | 'localstorage'
}

export type ConnectionConfig = CommonConnectionConfig & ({
    kind: 'remote';
    url: string;
    authHeader?: string;
} | {
    kind: 'fs';
    introspection: any;
} | {
    kind: 'github';
    clientId: string;
    clientSecret: string;
    state: string;
    accessToken?: string;
})

const LOCAL_CONNECTIONS_KEY = 'imtala:connections'

const createStore = () => {
    let storeState: 'not_initialised' | Promise<void> | 'complete' = 'not_initialised'
    let storeConnectionConfig
    let storeConnections

    const getLocalStorageData = () => {
        const localStorage = typeof window !== "undefined" && window.localStorage;
        const fallback = []
        const stored = localStorage
            ? localStorage.getItem(LOCAL_CONNECTIONS_KEY) || JSON.stringify(fallback)
            : JSON.stringify(fallback)

        try {
            return JSON.parse(stored)
        } catch (e) {
            console.error(`found bad data inside local storage with trying to access local connections`)
        }

        return fallback
    }

    const { subscribe, set, update } = writable<{
        connections: {
            [name: string]: any
        };
        connectionConfig: ConnectionConfig[];
        docGenIntrospection?: ConnectionConfig;
    }>({
        connections: {},
        connectionConfig: []
    })

    const fetchCliConfig = async (fetch: Fetch) => {
        const serverConfigResponse = await fetch('/cli-config.json')

        if (!serverConfigResponse.ok) {
            return [];
        }

        return await serverConfigResponse.json()
    }



    const initConnectionConfig = async (fetch: Fetch) => {
        const cliConfig = await fetchCliConfig(fetch)
        const serverConnections = cliConfig.connections;
        // const localConnections = getLocalStorageData()
        const docGenIntrospectionConnection = cliConfig.docGenIntrospection && cliConfig.connections.find(conn => conn.name === cliConfig.docGenIntrospection)

        const docGenIntrospectionState = docGenIntrospectionConnection ? {
            docGenIntrospection: docGenIntrospectionConnection
        } : {}
        update(state => ({
            ...state,
            ...docGenIntrospectionState,
            connectionConfig: serverConnections
        }))

        storeState = 'complete'
    }

    const initStore = async (fetch: Fetch) => {
        if (storeState === 'not_initialised') {
            storeState = initConnectionConfig(fetch)
            await storeState;

            return;
        }

        if (storeState instanceof Promise) {
            await storeState
        }
    }

    const getConnection = (connectionName: string): ConnectionConfig | undefined => {
        const existingConnection = storeConnectionConfig
            .find(connection => connection.name === connectionName)

        if (existingConnection) {
            return existingConnection
        }

        return getLocalStorageData().find(connection => connection.name === connectionName)

    }

    const initConnection = async (connectionName: string, fetch: Fetch) => {
        if (storeState === 'not_initialised') {
            throw new Error('Cannot initialise a connection before first initialising the store')
        }

        if (storeState instanceof Promise) {
            await storeState;
        }

        if (storeState instanceof Promise) {
            throw new Error('something bad has happened')
        }

        const connection = getConnection(connectionName)


        if (!connection) {
            throw new Error('could not find the requested connection inside config')
        }

        if (storeConnections[connectionName]) return;


        if (connection.kind === 'fs') { // renamed to prefetched?
            update(state => ({
                ...state,
                connections: {
                    ...state.connections,
                    [connection.name]: {
                        introspection: connection.introspection
                    }
                }
            }))
        } else {
            const introspectionResponse = await fetch(`/connection/${connectionName}/data`, {
                method: 'POST',
                body: JSON.stringify(connection),
            })

            const introspection = await introspectionResponse.json()

            update(state => ({
                ...state,
                connections: {
                    ...state.connections,
                    [connection.name]: {
                        introspection: { data: introspection }
                    }
                }
            }))
        }

    }

    subscribe(({ connectionConfig, connections }) => {
        storeConnectionConfig = connectionConfig
        storeConnections = connections

    })

    const rehydrateStore = async (fetch: Fetch) => {
        await initConnectionConfig(fetch)

        update(state => ({
            ...state,
            connectionConfig: state.connectionConfig.concat(getLocalStorageData())
        }))
    }

    const updateLocalConnection = (conn: ConnectionConfig) => {
        update(state => {
            const oldConnections = state.connectionConfig;
            const exists = oldConnections.some(oldConnection => oldConnection.name === conn.name)
            const newConnections = exists
                ? oldConnections.map(oldConnection => oldConnection.name === conn.name ? conn : oldConnection)
                : oldConnections.concat(conn)

            const localStorage = typeof window !== "undefined" && window.localStorage;


            localStorage && localStorage.setItem(
                LOCAL_CONNECTIONS_KEY,
                JSON.stringify(
                    newConnections.filter(connection => connection.storage === 'localstorage')))

            return {
                ...state,
                connectionConfig: newConnections
            }
        })
    }

    const oauthCallback = async (fetch: Fetch, connectionName: string, code: string, state: string) => {
        const connection = getConnection(connectionName)



        if (!connection) {
            throw new Error(`could not find the requested connection ${connectionName} inside config`)
        }

        if (connection.kind !== 'github') {
            throw new Error(`Oauth callback of connection kind ${connection.kind} is not supported`)
        }

        if (state !== connection.state) {
            throw new Error('state does not match')
        }


        const accessTokenResponse = await fetch(`/connection/${connectionName}/token`, {
            method: 'POST',
            body: JSON.stringify({
                clientId: connection.clientId,
                clientSecret:connection.clientSecret,
                code: code
            }),
            headers: {
                'Accept': 'Application/json'
            }
        })

        const {
            accessToken
        } = await accessTokenResponse.json()

        const updatedConnection = {
            ...connection,
            accessToken
        }

        updateLocalConnection(updatedConnection)
    }


    return {
        subscribe,
        rehydrateStore,
        oauthCallback,
        updateLocalConnection,
        addLocalConnection: conn => {
            update(state => {
                const newConnections = state.connectionConfig.concat(conn)

                const localStorage = typeof window !== "undefined" && window.localStorage;


                localStorage && localStorage.setItem(
                    LOCAL_CONNECTIONS_KEY,
                    JSON.stringify(
                        newConnections.filter(connection => connection.storage === 'localstorage')))

                return {
                    ...state,
                    connectionConfig: newConnections
                }
            })
        },
        initStore,
        initConnection
    }
}

export const connections = createStore()