import { writable } from "svelte/store";

import {
    getIntrospectionQuery,
} from 'graphql';
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

const introspectionStore = (() => {
    let initCalled = false;
    return {
        subscribe,
        init: async (fetch) => {
            if (initCalled) return;
            initCalled = true;

            try {
                const introspectionQueryResponse = await fetch('/graphql', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        query: getIntrospectionQuery()
                    })
                })
    
                if (!introspectionQueryResponse.ok) {
                    set({
                        kind: 'error',
                        status: introspectionQueryResponse.status as number,
                        error: await introspectionQueryResponse.json()
                    })
                }

                const introspectionQueryPayload = await introspectionQueryResponse.json()
    
                set({
                    kind: 'success',
                    status: introspectionQueryResponse.status as number,
                    introspectionQuery: introspectionQueryPayload as never as IntrospectionQuery
                })
            } catch (e) {
                set({
                    kind: 'error',
                    status: 500,
                    error: e
                })
            }
        }
    }
})();

export default introspectionStore
