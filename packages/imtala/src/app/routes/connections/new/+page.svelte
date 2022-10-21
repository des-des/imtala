<script lang="ts">
    import type { PageData } from './$types';
	export let data: PageData;
</script>

<main>
    <h1>Create a connection</h1>

    <ul>
        {#each data.providers as provider}
            <li><a href="{provider.loginUrl}">Add {provider.name} connection</a></li>
        {/each}
    </ul>
</main>

