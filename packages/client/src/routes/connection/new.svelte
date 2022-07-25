<script lang="ts">
	import { goto } from '$app/navigation';
	import Header from '@imtala/svelte-components/components/header.svelte';
	import type {GithubOauthConnection, HttpConnection} from '@imtala/svelte-components/api/db'

	let connectionType;
	let connectionName;
	let requestStatus;

	function handleSubmit(submitEvent) {
		requestStatus = 'pending';

		if (['gh', 'authcode'].includes(connectionType)) {
			const urls = connectionType === 'gh' ? {
				authorizationUrl: 'https://github.com/login/oauth/authorize',
				tokenUrl: 'https://github.com/login/oauth/access_token',
				graphqlUrl: 'https://api.github.com/graphql'
			} : {
				authorizationUrl: submitEvent.target['authorization-url'].value,
				tokenUrl: submitEvent.target['token-url'].value,
				graphqlUrl: submitEvent.target['graphql-url'].value,
				
			}
			const connection: GithubOauthConnection = {
				kind: 'github-oauth',
				name: submitEvent.target.name.value,
				clientId: submitEvent.target['client-id'].value,
				clientSecret: submitEvent.target['client-secret'].value,
				...urls
			}

			fetch('/connection', {
				'method': 'POST',
				body: JSON.stringify({connection}),
				headers: {
					['Content-Type']: 'application/json'
				}
			}).then(() => {
				requestStatus = 'success'
	    		goto(`/connection/${submitEvent.target.name.value}`);

			})
		} else {
			const connection: HttpConnection = {
				kind: 'http',
				name: submitEvent.target.name.value,
				url: submitEvent.target['url'].value,
			}
			const auth = submitEvent.target['header'].value


			fetch('/connection', {
				'method': 'POST',
				body: JSON.stringify({connection, auth}),
				headers: {
					['Content-Type']: 'application/json'
				}
			}).then(() => {
	    		goto(`/connection/${submitEvent.target.name.value}`);
			})
		}
	}
</script>

<Header />

<main>
	<form on:submit|preventDefault={handleSubmit}>
		<label for="authorization-type">connection type</label>
		<select name="authorization-type" bind:value={connectionType}>
			<option value="gh">Github oauth</option>
			<option value="authcode">Oauth2 authorisation code flow</option>
			<option value="http">Plain HTTP</option>
		</select>
		<label for="name">connection name</label>
		<input
			bind:value={connectionName}
			required
			name="name"
			type="text"
			placeholder="connection name"
		/>
		{#if connectionType === 'http'}
			<label for="url">Graphql endpoint url</label>
			<input required name="url" type="url" placeholder="https://" />
			<label for="header">(Optional) Authentication header</label>
			<input name="header" type="text" placeholder="Bearer xxxx" />
		<!-- {:else if connectionType === 'authcode'}
			<label for="callback-url">callback url</label>
			<input
				disabled
				name="callback-url"
				type="text"
				value={(connectionName && `http://localhost:3000/connection/${connectionName}/callback`) ||
					''}
			/>
			
			<label for="client-id">client id</label>
			<input required name="client-id" type="text" placeholder="xxxx" />
			<label for="client-secret">client secret</label>
			<input required name="client-secret" type="text" placeholder="xxxx" /> -->
		{:else}
			<label for="callback-url">callback url</label>
			<input
				disabled
				name="callback-url"
				type="url"
				value={(connectionName && `http://localhost:3000/connection/${connectionName}/callback`) ||
					''}
			/>
			{#if connectionType === 'authcode'}
				<label for="graphql-url">GraphQL url</label>
				<input
					name="graphql-url"
					type="url"
				/>
				<label for="authorization-url">Authorisation url</label>
				<input
					name="authorization-url"
					type="url"
				/>
				<label for="token-url">Token url</label>
				<input
					name="token-url"
					type="url"
				/>
				<label for="audience">Audience</label>
				<input
					name="audience"
					type="string"
				/>
			{/if}
			<label for="client-id">client id</label>
			<input required name="client-id" type="text" placeholder="xxxx" />
			<label for="client-secret">client secret</label>
			<input required name="client-secret" type="text" placeholder="xxxx" />
		{/if}
		<input type="submit" value="+ Add Connection" disabled={requestStatus === 'pending'}/>
	</form>
</main>

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

	input[type='submit']:hover {
		background-color: var(--lime-8);
	}
</style>
