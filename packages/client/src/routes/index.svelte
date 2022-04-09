<script context='module' lang='ts'>
    import {connections} from '@imtala/svelte-components/store/connections'

    export const prerender = false;

    /** @type {import('@sveltejs/kit').Load} */
	export async function load({ fetch }) {
        await connections.initStore(fetch);

        return {
            props: {
                fetch
            }
        }
    }

</script>

<script lang="ts">
    import { onMount } from 'svelte';
    export let fetch;

    onMount(() => {
        connections.rehydrateStore(fetch)
    })

    $: connectionList = $connections.connectionConfig
</script>

<style>
    .connection-card {
        display: inline-block;
        border: 1px solid var(--lime-1);
        cursor: pointer;
        padding: 0.8em;
        margin: 1em;
    }

    .connection-card__name {
        margin: 0;
        padding: 0 0 0.4em 0;
        font-size: 1.3em;
    }

    .connection-card__type {
        margin: 0;
        padding: 0;
    }

    .connection-card-list {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

</style>


<main class="main-content">
    <h1>Imtala</h1>
    <p>Graphql web client</p>

    <h2>Connections</h2>

    <div class='connection-card-list'>
    {#each connectionList as connection}
        <a class='connection-card' href="/connection/{connection.name}">
            <h3 class='connection-card__name'>
                {connection.name}
            </h3>
            {#if connection.kind === 'fs'}
            <p class='connection-card__type'>
                Introspection only
            </p>
            {:else if connection.kind === 'remote'}
            <p class='connection-card__type'>
                Remote connection
            </p>
            {/if}
        </a>
    {/each}

    <a class='connection-card' href='/connection/new'> + create new connection </a>
    </div>
</main>
