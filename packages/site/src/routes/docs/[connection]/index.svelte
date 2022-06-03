<script lang='ts'>
    import Header from '@imtala/svelte-components/components/header.svelte';
    import QueryBuilder from '@imtala/svelte-components/components/QueryBuilder.svelte'
    import type {Connection} from '@imtala/svelte-components/api/db'
    import { Kind, OperationTypeNode } from 'graphql';
    import type { OperationDefinitionNode } from 'graphql';

    import {print} from 'graphql'
    export let connection: Connection;
    export let introspection;

    const connectionName = connection.name;

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

<Header connectionRoot={connectionName} activeNav={'query-builder'} docRoot='root' rootLinkName='imtala'/>

<div class='wrapper'>
    <div style='max-width: 50vw; max-height: 100vh; overflow-y: scroll; padding-right: 2rem;'>
        <QueryBuilder
            bind:ast={ast}
            fieldName='query'
            introspectionQuery={introspection}
        />
    </div>
    <div style="border-left: 1px solid white; padding-left: 2rem;">
        <pre style='font-size: 14px;'>{print(ast)}</pre>
    </div>
</div>
    
<style>
    .wrapper {
        display: flex;
        flex-direction: row;
    }
</style>
