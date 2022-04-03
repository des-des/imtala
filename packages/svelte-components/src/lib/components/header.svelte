<script lang="ts">
    export let connectionRoot: string | undefined;
    export let activeNav: 'schema-exporer' | 'query-builder' | undefined
    export let docRoot = 'docs'
    export let rootLinkName = 'connections'

    $: queryBuilderLinkText = activeNav === 'query-builder' ? '*gql client' : 'gql client'
    $: schemaExplorerLinkText = activeNav === 'schema-exporer' ? '*schema explorer' : 'schema explorer'
</script>


<nav>
    <ul>
        <li><a href="/">{'<'} {rootLinkName}</a></li>
        {#if connectionRoot}
            <li><a href={`${connectionRoot}`}>{queryBuilderLinkText}</a></li>
            <li><a href={`${connectionRoot}/${docRoot}`}>{schemaExplorerLinkText}</a></li>
        {/if}
    </ul>
</nav>


<style>
    nav {
        width: 100%;
        border-bottom: 1px solid var(--light-2);
    }

    ul {
        display: flex;
        flex-direction: row;
    }

    li {
        padding: 0 1em 0 1em;
    }
</style>
