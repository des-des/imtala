<script context='module' lang='ts'>
    import introspectionStore, {StoreState} from '../lib/stores/introspectionQueryStore'
    import QueryBuilder from '../lib/components/QueryBuilder.svelte'
    import { getIntrospectionQuery } from 'graphql';

    /** @type {import('@sveltejs/kit').Load} */
	export async function load({ fetch }) {
        await introspectionStore.init(() =>
            fetch('/graphql', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    query: getIntrospectionQuery()
                })
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

    let ast;


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
                onUpdateAst={newAst => {ast = newAst}}
                typeName='Query'
                fieldName='query'
                introspectionQuery={introspectionRequest.introspectionQuery.data}
            />
        </div>
        <div style="border-left: 1px solid white; padding-left: 2rem;">
            <pre style='font-size: 1rem;'>
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
</style>
