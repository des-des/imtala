<script context='module' lang='ts'>
    import {connections} from '@imtala/svelte-components/store/connections'
    import { page } from '$app/stores'

    /** @type {import('@sveltejs/kit').Load} */
	export async function load({ fetch, params, url }) {
        await connections.initStore(fetch);

        await connections.oauthCallback(fetch, params.connection, url.searchParams.get('code'), url.searchParams.get('state'))

        return {
            props: {
                connectionName: params.connection
            }
        }
    }
</script>

<script lang='ts'>
	import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    export let connectionName: string;

    onMount(() => {
        goto(`/connection/${connectionName}`)
    })

</script>

<svelte:head>
    <title>callback</title>
</svelte:head>

loading