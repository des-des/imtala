<script context='module' lang='ts'>
    /** @type {import('@sveltejs/kit').Load} */
	export async function load({ fetch, params, url }) {
        return {
            props: {
                connectionName: url.searchParams.get('connection'),
				query: decodeURIComponent(url.searchParams.get('query-ast'))
            }
        }
    }
</script>

<script lang='ts'>
	export let connectionName;
	export let query;
    let pageName=''
	import { goto } from '$app/navigation';


	function handleSubmit(submitEvent) {
		fetch('/pages', {
				'method': 'POST',
				body: JSON.stringify({
					connectionName: submitEvent.target['connection-name'].value,
					name: submitEvent.target['page-name'].value,
					query:submitEvent.target['query'].value,
				}),
				headers: {
					['Content-Type']: 'application/json'
				}
			}).then(() => {
	    		goto(`/pages/${submitEvent.target['page-name'].value}`);
			})

	}
</script>

<svelte:head>
    <title>Create new page</title>
</svelte:head>

<h1>Create new page</h1>




<form on:submit|preventDefault={handleSubmit}>
	<label for="connection-name">Connection name</label>
	<input name="connection-name" disabled type="text" value="{connectionName}" />

	<label for="Query">Query</label>
	<textarea name="query" type="text" bind:value={query} rows={query.split('').filter(c => c === '\n').length + 1}/>

    <label for="page-name">Page name (lower case hyphenated)</label>
    <input name='page-name' pattern="[a-z\-]+" type='text' bind:value={pageName} />
    <br />
    <input type='submit' value='Create' />
</form>


<style>
	form {
		display: flex;
		flex-direction: column;
		margin: auto;
		width: 50%;
	}
	input,
	select {
		padding: 1em;
		margin: 1em;
	}

	input:invalid {
		border-color: var(--pink-3);
	}

	input:valid {
		border-color: var(--lime-4);
	}

	label {
		/* padding: 1em; */
		margin: 1em 1em 0em 1em;
	}

	input[type='submit'] {
		align-self: flex-end;
		width: 50%;
		cursor: pointer;
	}

    /* form:invalid>#submit {
        pointer-events: none;

    } */

	input[type='submit']:hover {
		background-color: var(--lime-8);
	}
</style>
