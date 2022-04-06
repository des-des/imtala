<script context='module' lang='ts'>
    import GraphQlRoot from '@imtala/svelte-components/components/GqlDocumentation.svelte'
    import {connections} from '@imtala/svelte-components/store/connections'

    /** @type {import('@sveltejs/kit').Load} */
	export async function load({ fetch, params }) {
        await connections.initStore(fetch);

        return {
            props: {
                typeName: params.typeName === 'root' ? undefined : params.typeName,
            }
        }
    }
</script>

<script lang='ts'>
	export let typeName: string;
</script>

<svelte:head>
    <title>{typeName}</title>
</svelte:head>

<GraphQlRoot introspectionQuery={$connections.docGenIntrospection.introspection.data} typeName={typeName}/>