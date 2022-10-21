<script lang="ts">
    import type { PageData } from './$types';
	export let data: PageData;
</script>

<h1>Login</h1>
<ul>
    {#each data.providers as provider}
        <li><a href="{provider.loginUrl}">Login with {provider.name}</a></li>
    {/each}
</ul>