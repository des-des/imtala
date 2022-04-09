<script context='module' lang='ts'>
    import {connections} from '@imtala/svelte-components/store/connections'

    /** @type {import('@sveltejs/kit').Load} */
	export async function load({ fetch, params }) {
        await connections.initStore(fetch);

        try {
            await connections.initConnection(params.connection, fetch)
        } catch (e) {
            console.error(e)
        }

        return {
            props: {
                typeName: params.typeName === 'root' ? undefined : params.typeName,
                connectionName: params.connection
            }
        }
    }
</script>

<script lang='ts'>
    import Header from '@imtala/svelte-components/components/header.svelte';
    import GraphQlRoot from '@imtala/svelte-components/components/GqlDocumentation.svelte'
    import { onMount } from 'svelte';

    export let connectionName: string;
	export let typeName: string;

    onMount(() => {
        connections.initConnection(connectionName, fetch)
    })

</script>

<svelte:head>
    <title>{typeName}</title>
</svelte:head>

<Header connectionRoot={`../${connectionName}`} activeNav={'schema-exporer'}/>

{#if $connections.connections[connectionName]}
    <GraphQlRoot introspectionQuery={$connections.connections[connectionName].introspection.data} typeName={typeName === 'docs' ? undefined : typeName}/>
{:else}
    <p>loading</p>
{/if}