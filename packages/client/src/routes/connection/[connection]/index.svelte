<script context='module' lang='ts'>
    export const ssr = false;

    import { Kind, OperationTypeNode } from 'graphql';
    import type { OperationDefinitionNode } from 'graphql';
    import {connections} from '@imtala/svelte-components/store/connections'


    /** @type {import('@sveltejs/kit').Load} */
	export async function load({ fetch, params}) {
        await connections.initStore(fetch);
        await connections.initConnection(params.connection, fetch)

        return {
            props: {
                connectionName: params.connection
            }
        }
    }
</script>

<script lang='ts'>
    import Header from '@imtala/svelte-components/components/header.svelte';
    import QueryBuilder from '@imtala/svelte-components/components/QueryBuilder.svelte'

    import {print} from 'graphql'

    export let connectionName;

    $: introspectionResult = $connections.connections[connectionName].introspection

    let ast: OperationDefinitionNode = {
		kind: Kind.OPERATION_DEFINITION,
		operation: OperationTypeNode.QUERY,
		selectionSet: {
			kind: Kind.SELECTION_SET,
			selections: []
		}
	};


</script>

<svelte:head>
    <title>Root types</title>
</svelte:head>

<Header connectionRoot={connectionName} activeNav={'query-builder'}/>


<div class='wrapper'>
    <div style='max-width: 50vw; max-height: 100vh; overflow-y: scroll; padding-right: 2rem;'>
        <QueryBuilder
            bind:ast={ast}
            typeName='Query'
            fieldName='query'
            introspectionQuery={introspectionResult.data}
        />
    </div>
    <div style="border-left: 1px solid white; padding-left: 2rem;">
        <pre style='font-size: 14px;'>
            {print(ast)}
        </pre>
    </div>
</div>
    
<style>
    .wrapper {
        display: flex;
        flex-direction: row;
    }
</style>
