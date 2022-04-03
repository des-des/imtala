<script context='module' lang='ts'>
    import GraphQlRoot from '@imtala/svelte-components/components/GqlDocumentation.svelte'
    import {connections} from '@imtala/svelte-components/store/connections'

    /** @type {import('@sveltejs/kit').Load} */
	export async function load({ fetch }) {
        
        await connections.initStore(fetch);


        return {
            props: {}
        }
    }
</script>


<svelte:head>
    <title>Imtala</title>
</svelte:head>

<GraphQlRoot introspectionQuery={$connections.docGenIntrospection.introspection.data} />