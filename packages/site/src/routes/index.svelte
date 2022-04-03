<main>
	<h1>Imtala</h1>

	Imtala is an interactive graphql client built using sveltekit.
	Imtala is built using SvelteKit, which gives it a couple of interesting advantages over the reference implementation of graphiql, which is built using react:
	<ol>
		<li> > Imtala can consume a graphql introspection query and emit a static website holding both an interactive query builder, and documentation for your api.</li>
		<li> > with staticly rendered html and a small js bundle, imtala generated documentation will feel snappy, is easy to host and will play well with search engines</li>
	</ol>

	<h2>Demo</h2>
	<ol>
		<li> > <a href="docs/github">Github GraphQL API documentation demo</a></li>
		<li> > <a href="docs/shopify">Shopify Storefront API documentation demo</a></li>
	</ol>

	<h2>Roadmap</h2>
	<ol>
		<li> > <s> Add new connections via web ui </s> </li>
		<li> > <s> Allow authentication via an authorization header </s> </li>
		<li> > Allow authentication via oauth2 </li>
		<li> > Execute querys against an api </li>
		<li> > A simple static site builder </li>
	</ol>

	Follow my <a href="https://twitter.com/eoin_des_des">twitter</a>, or this project's <a href="https://github.com/des-des/imtala">github</a>.
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