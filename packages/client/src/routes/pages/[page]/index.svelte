<script lang="ts">
	import QueryResponsePage from '@imtala/svelte-components/components/QueryResponsePage.svelte';

	export let connection;
	export let page;
	export let response;

    let pageTitle = page.name.replace('-', ' ')

    function handlePageSave(pageSettings) {
        fetch('/pages', {
				'method': 'POST',
				body: JSON.stringify({
                    ...page,
                    pageSettings
				}),
				headers: {
					['Content-Type']: 'application/json'
				}
			})

    }
</script>

<main>
	<QueryResponsePage pageTitle={pageTitle} json={response} {handlePageSave} pageSettings={page.pageSettings}/>
</main>

<style>
	main {
		margin-left: 10px;
		margin-right: 10px;
	}
	@media (min-width: 700px) {
		main {
			border-left: 1px solid white;
			padding-left: 15px;
			margin: auto;
			width: 800px;
		}
	}
</style>
