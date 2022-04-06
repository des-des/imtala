import { writable } from 'svelte/store'
import {browser} from '$app/env'

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
})

const LOCAL_CONNECTIONS_KEY = 'imtala:connections'

const createStore = () => {
    let storeState: 'not_initialised' | Promise<void> | 'complete' = 'not_initialised'
    let storeConnectionConfig
    let storeConnections

    const getLocalStorageData = () => {
        const fallback = []
        const stored = browser 
            ? localStorage.getItem(LOCAL_CONNECTIONS_KEY) || JSON.stringify(fallback)
            : JSON.stringify(fallback)

        try {
            return JSON.parse(stored)
        } catch (e) {
            console.error(`found bad data inside local storage with trying to access local connections`)
        }

        return fallback
    }

    const {subscribe, set, update} = writable<{
        connections: {
            [name: string]: any
        };
        connectionConfig: ConnectionConfig[];
        docGenIntrospection?: ConnectionConfig;
    }>({
        connections: { },
        connectionConfig: getLocalStorageData()
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
        const localConnections = getLocalStorageData()
        const docGenIntrospectionConnection = cliConfig.docGenIntrospection && cliConfig.connections.find(conn => conn.name === cliConfig.docGenIntrospection)

        const docGenIntrospectionState = docGenIntrospectionConnection ? {
            docGenIntrospection: docGenIntrospectionConnection
        } : {}
        update(state => ({
            ...state,
            ...docGenIntrospectionState,
            connectionConfig: serverConnections.concat(localConnections)
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


        const connection = storeConnectionConfig
            .find(connection => connection.name === connectionName)

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
                        introspection: {data: introspection}
                    }
                }
            }))
        }

    }

    subscribe(({connectionConfig, connections}) => {
        if (browser) {
            localStorage.setItem(LOCAL_CONNECTIONS_KEY, JSON.stringify(connectionConfig.filter(connection => connection.storage === 'localstorage')))
        }

        storeConnectionConfig = connectionConfig
        storeConnections = connections

    })


    return {
        subscribe,
        addLocalConnection: conn => update(state => ({
            ...state,
            connectionConfig: state.connectionConfig.concat(conn)
        })),
        initStore,
        initConnection
    }
}

export const connections = createStore()