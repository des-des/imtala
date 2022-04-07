import { writable } from "svelte/store";

import type { IntrospectionQuery } from 'graphql'

export type StoreState = {
    kind: 'initialising';
} | {
    kind: 'success';
    introspectionQuery: IntrospectionQuery;
    status: number;
} | {
    kind: 'error';
    error: any;
    status: number;
}

const { subscribe, set } = writable<StoreState>({
    kind: 'initialising'
});

const createIntrospectionStore = () => {
    let initCalled = false;
    return {
        subscribe,
        init: async (fetchIntrospection) => {
            if (initCalled) return;
            initCalled = true;

            try {
                const introspectionQueryResponse = await fetchIntrospection();
    
                if (!introspectionQueryResponse.ok) {
                    const payload = await introspectionQueryResponse.json()

                    console.error(payload)
                    set({
                        kind: 'error',
                        status: introspectionQueryResponse.status as number,
                        error: payload
                    })
                }

                const introspectionQueryPayload = await introspectionQueryResponse.json()

                set({
                    kind: 'success',
                    status: introspectionQueryResponse.status as number,
                    introspectionQuery: introspectionQueryPayload as never as IntrospectionQuery
                })
            } catch (e) {
                console.error(e);
                
                set({
                    kind: 'error',
                    status: 500,
                    error: e
                })
            }
        }
    }
};

export default createIntrospectionStore
