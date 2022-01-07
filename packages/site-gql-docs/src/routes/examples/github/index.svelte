<script context="module" lang="ts">
	import introspectionStore, { StoreState } from '../../../lib/stores/githubIntrospectionStore';
	import { GqlDocumentation } from '@imtala/gql-docs';

	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ fetch, url }) {
		await introspectionStore.init(() => fetch(`/examples/github/introspection.json`));

		return {
			props: {}
		};
	}
</script>

<script lang="ts">
	let introspectionRequest: StoreState;

	introspectionStore.subscribe((introspectionState) => {
		introspectionRequest = introspectionState;
	});

	import { base } from '$app/paths';
</script>

<svelte:head>
	<title>Root types</title>
</svelte:head>

{#if !introspectionRequest || introspectionRequest.kind === 'initialising'}
	<span>LOADING</span>
{:else if introspectionRequest.kind === 'error'}
	<span>Error</span>
	<pre>
        {JSON.stringify(introspectionRequest.error, null, 4)}
    </pre>
{:else}
	<GqlDocumentation
		introspectionQuery={introspectionRequest.introspectionQuery}
		rootPath={`${base}/examples/github`}
	/>
{/if}
