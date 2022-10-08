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

    let responseData

    const mockRequest = `
    {
        repository(owner: "des-des", name: "imtala") {
            issues(first: 20) {
            nodes {
                title
                bodyText
            }
            }
        }
    }
`

    function handleRequest() {
        fetch(`/connection/${connection.name}/query`, {
            method: 'POST',
            body: print(ast)
        }).then(res => {
            return res.json()
        }).then((data) => {
            responseData = data
        }).catch(e => {
            console.error(e)
        })
    }


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
        <div class='schema-container' style=' max-height: 100vh; overflow-y: scroll; padding-right: 2rem;'>
                <QueryBuilder
                    bind:ast={ast}
                    typeName='Query'
                    fieldName='query'
                    introspectionQuery={introspection}
                />
        </div>
        <div class='query-container'>
            <pre style='font-size: 14px;'>{print(ast)}</pre>
        </div>
        <div class='request-container'>
            <br />
            <button on:click={handleRequest}>Execute query</button>
            <a href='/pages/new?connection={connection.name}&query-ast={encodeURIComponent(print(ast))}'>Create new page</a>
            {#if responseData}
                <pre class='request-container__response'>{JSON.stringify(responseData, null, 4)}</pre>
            {/if}
        </div>
    </div>
{/if}
    
<style>
    .wrapper {
        display: flex;
        flex-direction: row;
    }

    .schema-container {
        width: 33%;
    }
    .query-container {
        border-left: 1px solid white;
        padding-left: 2rem;
        width: 33%;
    }
    .request-container {
        border-left: 1px solid white;
        padding-left: 2rem;
        width: 33%;
    }

    .request-container__response {
        white-space: pre-wrap;
    }
</style>
