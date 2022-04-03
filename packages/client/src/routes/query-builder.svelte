<!-- <script context='module' lang='ts'>
    import introspectionStore from '../lib/introspectionQueryStore'
    import type {StoreState} from '../lib/introspectionQueryStore'
    import QueryBuilder from '@imtala/gql-docs/components/QueryBuilder.svelte'
    import { Kind, OperationTypeNode } from 'graphql';
    import type { OperationDefinitionNode } from 'graphql';

    /** @type {import('@sveltejs/kit').Load} */
	export async function load({ fetch }) {
        await introspectionStore.init(() =>
            fetch('/graphql.json', {
                method: 'GET',
            })
        )

        return {
            props: {}
        }
    }
</script>

<script lang='ts'>
    import {print} from 'graphql'
    let introspectionRequest: StoreState;
    
    introspectionStore.subscribe((introspectionState) => {
        introspectionRequest = introspectionState
    })

	// type AstRoot = FieldNode | OperationDefinitionNode;

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


{#if !introspectionRequest || introspectionRequest.kind === 'initialising'}
  <span>LOADING</span>
{:else if introspectionRequest.kind === 'error'}
    <span>Error</span>
    <pre>
        {JSON.stringify(introspectionRequest.error, null, 4)}
    </pre>
{:else}
    <div class='wrapper'>
        <div style='max-width: 50vw; max-height: 100vh; overflow-y: scroll; padding-right: 2rem;'>
            <QueryBuilder
                bind:ast={ast}
                typeName='Query'
                fieldName='query'
                introspectionQuery={introspectionRequest.introspectionQuery.data}
            />
        </div>
        <div style="border-left: 1px solid white; padding-left: 2rem;">
            <pre style='font-size: 14px;'>
                {print(ast)}
            </pre>
        </div>
    </div>
    
{/if}

<style>
    .wrapper {
        display: flex;
        flex-direction: row;
    }
</style> -->
