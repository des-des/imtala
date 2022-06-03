<script lang='ts'>
    import type {DocumentationProps} from './DocProps'
    import TypeLink from './TypeLink.svelte'
    import TypeLinkV2 from './TypeLinkV2.svelte'


    export let documentationProps: DocumentationProps
    export let titlePrepend = ''

</script>
<svelte:head>
    <title>
        {documentationProps.title}
    </title>
    <meta name='description' content="{documentationProps.description}">
</svelte:head>

{#if documentationProps.pageKind === 'root'}
    <h1>
        {titlePrepend || ''}Root types
    </h1>
    <p>
        {documentationProps.description ||
            'A GraphQL schema provides a root type for each kind of operation.'}
    </p>

    {#if documentationProps.queryType}
        <h2>
            Query Type
        </h2>

        <TypeLinkV2 typeName={documentationProps.queryType.typeName} description={documentationProps.queryType.description}/>
    {/if}

    {#if documentationProps.mutationType}
        <h2>
            Mutation Type
        </h2>
        <TypeLinkV2 typeName={documentationProps.mutationType.typeName} description={documentationProps.mutationType.description}/>
    {/if}

    {#if documentationProps.subscriptionType}
        <h2>
            Subscription Type
        </h2>

        <TypeLinkV2 typeName={documentationProps.subscriptionType.typeName} description={documentationProps.subscriptionType.description}/>
    {/if}
{:else}
    <h1>{titlePrepend}{documentationProps.name}</h1>

    <p>
        {documentationProps.description || 'No Description'}
    </p>


    {#if documentationProps.possibleTypes}
        <h2>Possible Types</h2>
        <ul>
            {#each documentationProps.possibleTypes as possibleType}
                <li><TypeLinkV2 typeName={possibleType.typeName} description={possibleType.typeDescription}/></li>
            {/each}
        </ul>
    {:else if documentationProps.possibleValues}
        <h2>Possible Values</h2>
        <ul>
            {#each documentationProps.possibleValues as enumValue}
                <li>{enumValue.name}</li>
            {/each}
        </ul>
    {:else if documentationProps.implementions}
        <h2>Implementations</h2>
        <ul>
            {#each documentationProps.implementions as possibleType }
                <li><TypeLinkV2 typeName={possibleType.typeName} description={possibleType.typeDescription}/></li>
            {/each}
        </ul>
    {:else if documentationProps.implements}
        <h2>Implements</h2>
        <ul>
            {#each documentationProps.implements as implementsInterface}
                <li><TypeLinkV2 typeName={implementsInterface.typeName} description={implementsInterface.typeDescription}/></li>
            {/each}
        </ul>
    {/if}

    {#if documentationProps.fields && documentationProps.fields.length > 0}
        <h2>Fields</h2>

        {#each documentationProps.fields as field}
            <p>
                {field.name}
                {#if 'args' in field && field.args.length}
                (<br />{#each field.args as arg}
                    &nbsp; &nbsp; &nbsp; &nbsp;<span>{arg.name}: <TypeLinkV2 typeName={arg.name} description={arg.description}/></span><br />
                {/each}
                )
                {/if}
                {': '}
                <TypeLinkV2 typeName={field.typeName} description={field.typeLinkDescription}/>
            </p>
        {/each}
    {/if}
{/if}
