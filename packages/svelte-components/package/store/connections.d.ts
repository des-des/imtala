declare type Fetch = (info: RequestInfo, init?: RequestInit) => Promise<Response>;
interface CommonConnectionConfig {
    name: string;
    storage: 'server' | 'localstorage';
}
export declare type ConnectionConfig = CommonConnectionConfig & ({
    kind: 'remote';
    url: string;
    authHeader?: string;
} | {
    kind: 'fs';
    introspection: any;
});
export declare const connections: {
    subscribe: (this: void, run: import("svelte/store").Subscriber<{
        connections: {
            [name: string]: any;
        };
        connectionConfig: ConnectionConfig[];
        docGenIntrospection?: ConnectionConfig;
    }>, invalidate?: (value?: {
        connections: {
            [name: string]: any;
        };
        connectionConfig: ConnectionConfig[];
        docGenIntrospection?: ConnectionConfig;
    }) => void) => import("svelte/store").Unsubscriber;
    rehydrateStore: (fetch: Fetch) => Promise<void>;
    addLocalConnection: (conn: any) => void;
    initStore: (fetch: Fetch) => Promise<void>;
    initConnection: (connectionName: string, fetch: Fetch) => Promise<void>;
};
export {};
