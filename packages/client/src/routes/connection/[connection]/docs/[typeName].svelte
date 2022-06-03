<script lang="ts">
	import Header from '@imtala/svelte-components/components/header.svelte';
	import GraphQlRoot from '@imtala/svelte-components/components/GqlDocumentationV2.svelte';

	export let documentationProps;
	export let typeName;
	export let connectionName;

	const titlePrepend = connectionName
		.split('')
		.map((c, i) => i === 0 ? c.toUpperCase() : c)
		.join('')
</script>

<svelte:head>
	<title>{typeName}</title>
</svelte:head>

<Header connectionRoot={`../../${connectionName}`} activeNav={'schema-exporer'} docRoot={`docs/root`}/>

<main>
    <!-- <h1>{connectionName} graphql documentation</h1> -->
    <GraphQlRoot documentationProps={documentationProps}/>
</main>


<style>
	main {
		margin-left: 10px;
		margin-right: 10px;
	}
	@media (min-width: 1000px) {
		main {
			border-left: 1px solid white;
			padding-left: 15px;
			margin: auto;
			width: 900px
		}
	}
</style>