<script lang="ts">
	import { onMount } from "svelte";
    import {connections} from '@imtala/svelte-components/store/connections'

	
	onMount(() => {
        connections.initStore(fetch);
        connections.initConnection('github', fetch)
        connections.initConnection('spotify', fetch)
	})
</script>

<main>
	<h1>Imtala</h1>

	<p> Imtala is an opne source interactive graphql client and toolkit. </p>

	<p>With it you can:</p>
	<ol>
		<li> > Save configurations to connect to multiple different graphql endpoints</li>
		<li> > Authenticate using Oauth2 (No more copy-pasting auth tokens) </li>
		<li> > Generate static documentation for your GraphQL API </li>
		<li> > Explore your api and build queries with an interactive query builder </li>
	</ol>

	<p>
		Imtala is built with svelte and has a lightweight client, it feels snappy and does not have the same memory footprint of the react based graphiql. 
	</p>
	<p>
		Find installation and usage instructions in the <a href="https://github.com/des-des/imtala">Imtala github repository</a>.
	</p>
	<h2>Demos</h2>
	<ol>
		<li> > <a sveltekit:prefetch href="docs/github">Github GraphQL API</a></li>
		<li> > <a sveltekit:prefetch href="docs/shopify">Shopify Storefront API</a></li>
	</ol>

	<h2>Roadmap</h2>
	<ol>
		<li> > <s> Interactive query builder and documentation generation </s> </li>
		<li> > <s> Add new connections via web ui </s> </li>
		<li> > <s> Allow authentication via an authorization header </s> </li>
		<li> > <s>Allow authentication via oauth2 </s> </li>
		<li> > A simple static site builder </li>
	</ol>

	Follow my <a href="https://twitter.com/eoin_des_des">twitter</a> for updates.
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
			width: 600px
		}
	}
</style>