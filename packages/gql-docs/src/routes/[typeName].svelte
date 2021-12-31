<script context='module' lang='ts'>
    import introspectionStore, {StoreState} from '../lib/stores/introspectionQueryStore'
    import GraphQlRoot from '../lib/components/GraphQLRoot.svelte'
    import { getIntrospectionQuery } from 'graphql';

    /** @type {import('@sveltejs/kit').Load} */
	export async function load({ fetch, page }) {
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
            props: {
                typeName: page.params.typeName,
            }
        }
    }
</script>

<script lang='ts'>
    let introspectionRequest: StoreState;
    
    introspectionStore.subscribe((introspectionState) => {
        introspectionRequest = introspectionState
    })

	export let typeName: string;
</script>

<svelte:head>
    <title>{typeName}</title>
</svelte:head>

{#if !introspectionRequest || introspectionRequest.kind === 'initialising'}
  <span>LOADING</span>
{:else if introspectionRequest.kind === 'error'}
    <span>Error</span>
    <pre>
        {JSON.stringify(introspectionRequest.error, null, 4)}
    </pre>
{:else}
    <GraphQlRoot introspectionQuery={introspectionRequest.introspectionQuery} typeName={typeName}/>
{/if}