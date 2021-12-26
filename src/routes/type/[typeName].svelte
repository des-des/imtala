<script context='module' lang='ts'>
    // export const prerender = true;

    import {
        getIntrospectionQuery,
        buildClientSchema
    } from 'graphql';


    const introspectionQuery = getIntrospectionQuery()

    /** @type {import('@sveltejs/kit').Load} */
	export async function load({ page, fetch, session, stuff }) {
        try {
            const introspectionQueryResponse = await fetch('/graphql', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    query: introspectionQuery
                })
            })

            if (introspectionQueryResponse.ok) {
                return {
                    props: {
                        type: page.params.typeName,
                        introspectionQueryResponse: await introspectionQueryResponse.json()
                    }
                };
            } else {
                return {
                    status: introspectionQueryResponse.status,
                    error: 'request failed'
                }
            }

        } catch (error) {
            console.error('LOADING FAILED WITH ERROR', error)
            console.error(error)
            return {
                error
            }
        }

    }
</script>

<script lang='ts'>
    
    import TypeLink from '../../lib/TypeLink.svelte'
	export let introspectionQueryResponse;
	export let type: string;
    export let schema = buildClientSchema(introspectionQueryResponse)

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