
<script lang='ts'>
    import Header from '@imtala/svelte-components/components/header.svelte';
    import Footer from '@imtala/svelte-components/components/Footer.svelte';
    import GraphQlRoot from '@imtala/svelte-components/components/GqlDocumentationV2.svelte'
    import type {DocumentationProps} from '@imtala/svelte-components/components/DocProps'

    export let documentationProps: DocumentationProps;
	export let typeName;
	export let connectionName;

    const titlePrepend = connectionName
		.split('')
		.map((c, i) => i === 0 ? c.toUpperCase() : c)
		.join('')
</script>

<svelte:head>
    <title>{typeName}</title>
    <meta name="description" content="{documentationProps.description}">
</svelte:head>

<Header connectionRoot={`../${connectionName}`} activeNav={'schema-exporer'} docRoot='root' rootLinkName='imtala'/>

<main>
    <GraphQlRoot {documentationProps} titlePrepend={`${titlePrepend} GraphQL API / `}/>
</main>

<Footer>
    Documentation created using <a href='/'>imtala</a>
</Footer>

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
