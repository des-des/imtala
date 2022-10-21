<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<main>

	{#if !data.user}
    	<h1>Welcome to Imtala</h1>
	
        Get started by <a href="/connections/new">creating a connection</a>, or
		<a href="/auth/login">login</a>
	{:else}
		<h1>Hi {data.user.fullName.split(' ')[0]}, Welcome to Imtala</h1>
        <h2>Connections</h2>
		<ul>
			{#each data.connections as connection}
				<li>{connection.name}</li>
			{/each}
		</ul>
	{/if}

	<p>features coming soon</p>

	<h2>Todo</h2>
	<ul>
		<li>Tenent and session management</li>
	</ul>
</main>
