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

<script lang="ts">
    $: introspection = $connections.docGenIntrospection && $connections.docGenIntrospection.kind === 'fs' && $connections.docGenIntrospection && $connections.docGenIntrospection.introspection.data
</script>


<svelte:head>
    <title>Imtala</title>
</svelte:head>

<GraphQlRoot introspectionQuery={introspection} />