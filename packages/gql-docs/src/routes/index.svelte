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

    $: schema = schemaRequest && schemaRequest.kind === 'success' && schemaRequest.schema

	$: queryType = schema && schema.getQueryType();
	$: mutationType = schema && schema.getMutationType();
	$: subscriptionType = schema && schema.getSubscriptionType();
</script>

<svelte:head>
    <title>Root types</title>
</svelte:head>


{#if !schemaRequest || schemaRequest.kind === 'initialising'}
  <span>LOADING</span>
{:else if schemaRequest.kind === 'error'}
    <span>Error</span>
{:else}
    <p>
        {schemaRequest.schema.description ||
            'A GraphQL schema provides a root type for each kind of operation.'}
    </p>

    {#if queryType}
        <h2>
            Query Type
        </h2>

        <TypeLink type={queryType} />
    {/if}

    {#if mutationType}
        <h2>
            Mutation Type
        </h2>

        <TypeLink type={mutationType} />
    {/if}

    {#if subscriptionType}
        <h2>
            Subscription Type
        </h2>

        <TypeLink type={subscriptionType} />
    {/if}
{/if}