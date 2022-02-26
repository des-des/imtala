<script context='module' lang='ts'>
    import introspectionStore from '$lib/introspectionQueryStore'
    import type {StoreState} from '$lib/introspectionQueryStore'
    import GraphQlRoot from '@imtala/gql-docs/components/GqlDocumentation.svelte'

    /** @type {import('@sveltejs/kit').Load} */
	export async function load({ fetch, params }) {
        await introspectionStore.init(() =>
            fetch('./graphql.json', {
                method: 'GET'
            })
        )

        console.log({params})

        return {
            props: {
                typeName: params.typeName === 'root' ? undefined : params.typeName,
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
    <GraphQlRoot introspectionQuery={introspectionRequest.introspectionQuery.data} typeName={typeName}/>
{/if}