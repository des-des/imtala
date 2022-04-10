import { writable } from 'svelte/store';
const LOCAL_CONNECTIONS_KEY = 'imtala:connections';
const createStore = () => {
    let storeState = 'not_initialised';
    let storeConnectionConfig;
    let storeConnections;
    const getLocalStorageData = () => {
        const localStorage = typeof window !== "undefined" && window.localStorage;
        const fallback = [];
        const stored = localStorage
            ? localStorage.getItem(LOCAL_CONNECTIONS_KEY) || JSON.stringify(fallback)
            : JSON.stringify(fallback);
        try {
            return JSON.parse(stored);
        }
        catch (e) {
            console.error(`found bad data inside local storage with trying to access local connections`);
        }
        return fallback;
    };
    const { subscribe, set, update } = writable({
        connections: {},
        connectionConfig: []
    });
    const fetchCliConfig = async (fetch) => {
        const serverConfigResponse = await fetch('/cli-config.json');
        if (!serverConfigResponse.ok) {
            return [];
        }
        return await serverConfigResponse.json();
    };
    const initConnectionConfig = async (fetch) => {
        const cliConfig = await fetchCliConfig(fetch);
        const serverConnections = cliConfig.connections;
        // const localConnections = getLocalStorageData()
        const docGenIntrospectionConnection = cliConfig.docGenIntrospection && cliConfig.connections.find(conn => conn.name === cliConfig.docGenIntrospection);
        const docGenIntrospectionState = docGenIntrospectionConnection ? {
            docGenIntrospection: docGenIntrospectionConnection
        } : {};
        update(state => ({
            ...state,
            ...docGenIntrospectionState,
            connectionConfig: serverConnections
        }));
        storeState = 'complete';
    };
    const initStore = async (fetch) => {
        if (storeState === 'not_initialised') {
            storeState = initConnectionConfig(fetch);
            await storeState;
            return;
        }
        if (storeState instanceof Promise) {
            await storeState;
        }
    };
    const initConnection = async (connectionName, fetch) => {
        if (storeState === 'not_initialised') {
            throw new Error('Cannot initialise a connection before first initialising the store');
        }
        if (storeState instanceof Promise) {
            await storeState;
        }
        if (storeState instanceof Promise) {
            throw new Error('something bad has happened');
        }
        const existingConnection = storeConnectionConfig
            .find(connection => connection.name === connectionName);
        const local = getLocalStorageData();
        const connection = existingConnection || local.find(connection => connection.name === connectionName);
        if (!connection) {
            throw new Error('could not find the requested connection inside config');
        }
        if (storeConnections[connectionName])
            return;
        if (connection.kind === 'fs') { // renamed to prefetched?
            update(state => ({
                ...state,
                connections: {
                    ...state.connections,
                    [connection.name]: {
                        introspection: connection.introspection
                    }
                }
            }));
        }
        else {
            const introspectionResponse = await fetch(`/connection/${connectionName}/data`, {
                method: 'POST',
                body: JSON.stringify(connection),
            });
            const introspection = await introspectionResponse.json();
            update(state => ({
                ...state,
                connections: {
                    ...state.connections,
                    [connection.name]: {
                        introspection: { data: introspection }
                    }
                }
            }));
        }
    };
    subscribe(({ connectionConfig, connections }) => {
        storeConnectionConfig = connectionConfig;
        storeConnections = connections;
    });
    const rehydrateStore = async (fetch) => {
        await initConnectionConfig(fetch);
        update(state => ({
            ...state,
            connectionConfig: state.connectionConfig.concat(getLocalStorageData())
        }));
    };
    return {
        subscribe,
        rehydrateStore,
        addLocalConnection: conn => {
            update(state => {
                const newConnections = state.connectionConfig.concat(conn);
                const localStorage = typeof window !== "undefined" && window.localStorage;
                localStorage && localStorage.setItem(LOCAL_CONNECTIONS_KEY, JSON.stringify(newConnections.filter(connection => connection.storage === 'localstorage')));
                return {
                    ...state,
                    connectionConfig: newConnections
                };
            });
        },
        initStore,
        initConnection
    };
};
export const connections = createStore();
