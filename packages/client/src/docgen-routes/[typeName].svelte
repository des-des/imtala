<script lang="ts">
    import GraphQlRoot from '@imtala/svelte-components/components/GqlDocumentationV2.svelte'
    export let documentationProps
    export let connectionName
</script>


<main>
    <GraphQlRoot documentationProps={documentationProps} />
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