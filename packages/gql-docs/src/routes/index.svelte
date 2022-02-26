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
		<li> > <a href="docs">Github GraphQL API documentation demo</a></li>
		<li> > <a href="query-builder">Github GraphQL API interactive client</a></li>
	</ol>

	
	<h2>Roadmap</h2>
	<ol>
		<li> > Execute querys against your api from within imtala</li>
		<li> > Static website builder: Quickly build html views on top of your graphql query from within the web client; then emit a lightweight static website in a few clicks</li>
	</ol>
</main>
