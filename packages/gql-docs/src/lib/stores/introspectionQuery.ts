import { writable } from "svelte/store";

import {
    getIntrospectionQuery,
    buildClientSchema,
} from 'graphql';

import type {
    GraphQLSchema
} from 'graphql'

export type StoreState = {
    kind: 'initialising';
} | {
    kind: 'success';
    schema: GraphQLSchema;
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
    
                set({
                    kind: 'success',
                    status: introspectionQueryResponse.status as number,
                    schema: buildClientSchema(await introspectionQueryResponse.json())
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
