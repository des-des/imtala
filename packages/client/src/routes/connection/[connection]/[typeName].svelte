<script context='module' lang='ts'>
    import {connections} from '@imtala/svelte-components/store/connections'

    /** @type {import('@sveltejs/kit').Load} */
	export async function load({ fetch, params }) {
        await connections.initStore(fetch);
        await connections.initConnection(params.connection, fetch)

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

    export let connectionName: string;
	export let typeName: string;
</script>

<svelte:head>
    <title>{typeName}</title>
</svelte:head>

<Header connectionRoot={`../${connectionName}`} activeNav={'schema-exporer'}/>


<GraphQlRoot introspectionQuery={$connections.connections[connectionName].introspection.data} typeName={typeName === 'docs' ? undefined : typeName}/>