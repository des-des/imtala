<script lang='ts'>
    import { Kind, OperationTypeNode } from 'graphql';
    import type { OperationDefinitionNode } from 'graphql';
    
    import type {Connection} from '../../../db'
    export let connection: Connection;
    export let message: string;
    export let introspection: any;
    import Header from '@imtala/svelte-components/components/header.svelte';
    import QueryBuilder from '@imtala/svelte-components/components/QueryBuilder.svelte'

    import {print} from 'graphql'

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


<Header connectionRoot={connection.name} activeNav={'query-builder'} docRoot={`docs/root`}/>

{#if message === 'missing auth headers'}
    <p>Authentication required to connection to {connection.name}</p>

    {#if connection.kind === 'github-oauth'}
        <a href='{connection.authorizationUrl}?client_id={connection.clientId}&response_type=code&redirect_uri={encodeURI(`http://localhost:3000/connection/${connection.name}/callback`)} {connection.audience ? `&audience=${connection.audience}` : ''}'>connect</a>
    {/if}
{:else if message}
    <p>Failed to establish connection</p>
    <p>{message}</p>
{:else if introspection}
    <div class='wrapper'>
        <div style='max-width: 50vw; max-height: 100vh; overflow-y: scroll; padding-right: 2rem;'>
                <QueryBuilder
                    bind:ast={ast}
                    typeName='Query'
                    fieldName='query'
                    introspectionQuery={introspection}
                />
        </div>
        <div style="border-left: 1px solid white; padding-left: 2rem;">
            <pre style='font-size: 14px;'>{print(ast)}</pre>
        </div>
    </div>
{/if}
    
<style>
    .wrapper {
        display: flex;
        flex-direction: row;
    }
</style>
