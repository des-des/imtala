<script context='module' lang='ts'>
    import introspectionStore, {StoreState} from '../lib/stores/introspectionQuery'
    import TypeLink from '../lib/TypeLink.svelte'

    /** @type {import('@sveltejs/kit').Load} */
	export async function load({ fetch }) {
        await introspectionStore.init(fetch)

        return {
            props: {}
        }
    }
</script>

<script lang='ts'>
    let schemaRequest: StoreState;
    
    introspectionStore.subscribe((introspectionState) => {
        schemaRequest = introspectionState
    })

	$: queryType = schemaRequest && schemaRequest.kind === 'success' && schemaRequest.schema.getQueryType();
</script>

{#if !schemaRequest || schemaRequest.kind === 'initialising'}
  <span>LOADING</span>
{:else if schemaRequest.kind === 'error'}
    <span>Error</span>
{:else}
    <p>
        {schemaRequest.schema.description ||
            'A GraphQL schema provides a root type for each kind of operation.'}
    </p>

    <h2>
        root types
    </h2>

    <TypeLink type={queryType} />
{/if}