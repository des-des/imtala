<script context='module' lang='ts'>
    import introspectionStore, {StoreState} from '../../lib/stores/introspectionQuery'
    import TypeLink from '../../lib/TypeLink.svelte'

    /** @type {import('@sveltejs/kit').Load} */
	export async function load({ fetch, page }) {
        await introspectionStore.init(fetch)        

        return {
            props: {
                type: page.params.typeName,
            }
        };
    };
</script>

<script lang='ts'>
    
    let schemaRequest: StoreState;
    
    introspectionStore.subscribe((introspectionState) => {
        schemaRequest = introspectionState
    })

	export let type: string;
    $: schema = schemaRequest && schemaRequest.kind ==='success' && schemaRequest.schema

    import {
        GraphQLUnionType,
        GraphQLInterfaceType,
        GraphQLObjectType,
        GraphQLEnumType
    } from 'graphql';

    $: currentPageType = schema.getType(type)


    $: fieldMap = 'getFields' in currentPageType && currentPageType.getFields();
    $: fields = Object.keys(fieldMap).map(k => fieldMap[k])
    $: schemaTypeMap = schema.getTypeMap()

</script>

<h1>{type}</h1>

<p>
    {('description' in currentPageType && currentPageType.description) || 'No Description'}
</p>


{#if currentPageType instanceof GraphQLUnionType}
    <h2>Possible Types</h2>
{:else if currentPageType instanceof GraphQLEnumType}
    <h2>Possible Values</h2>
    <ul>
        {#each currentPageType.getValues() as enumValue}
            <li>{enumValue.name}</li>
        {/each}
    </ul>
{:else if currentPageType instanceof GraphQLInterfaceType}
    <h2>Implementations</h2>
    <ul>
        {#each schema.getPossibleTypes(currentPageType) as possibleType }
            <li><TypeLink type={possibleType} /></li>
        {/each}
    </ul>
{:else if currentPageType instanceof GraphQLObjectType}
    <h2>Implements</h2>
    <ul>
        {#each currentPageType.getInterfaces() as implementsInterface}
            <li><TypeLink type={implementsInterface} /></li>
        {/each}
    </ul>
{/if}

{#if fields && fields.length > 0}
    <h2>Fields</h2>

    {#each fields as field}
        <p>
            {field.name}
            {#if 'args' in field && field.args.length}
            (<br />{#each field.args as arg}
                &nbsp; &nbsp; &nbsp; &nbsp;<span>{arg.name}: <TypeLink type={arg.type} /></span><br />
            {/each}
            )
            {/if}
            {': '}
            <TypeLink type={field.type} />
        </p>
    {/each}
{/if}