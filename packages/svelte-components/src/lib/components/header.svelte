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
    <div class='fade-out'>
    </div>
</nav>
<div class='spacer'></div>

<style>
    .fade-out {
        background: linear-gradient(to bottom,  rgba(0,0,0,1) 0%,rgb(0, 0, 0, 0) 100%);
        height: 2em;
    }
    .spacer {
        height: 4em;
        width: 100%;
        z-index: 2;
    }
    nav {
        width: 100%;
        position: fixed;
        height: 5em;
        z-index: 3;
    }

    ul {
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid white;
        background-color: black;
        margin-bottom: 0;
        margin-top: 0;
        padding-bottom: 1em;
        padding-top: 1em;
    }

    li {
        padding: 0 1em 0 1em;
    }
</style>