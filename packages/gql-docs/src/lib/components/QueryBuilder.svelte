<script lang='ts'>
    import {
        buildClientSchema,
        GraphQLType,
        isScalarType
    } from 'graphql';
    import type { IntrospectionQuery } from 'graphql'
    import { createEventDispatcher } from 'svelte';
    export let introspectionQuery: any;

    const dispatch = createEventDispatcher();
    const resolvesTo = (type: GraphQLType): string => 'ofType' in type ? resolvesTo(type.ofType) : type.name;
    const resolvesToScalarType = (type: GraphQLType): boolean => 'ofType' in type ? resolvesToScalarType(type.ofType) : isScalarType(type);
    export let typeName: string = undefined;

    const schema = buildClientSchema(introspectionQuery as never as IntrospectionQuery)
    const pageType = schema.getType(typeName)
    const fieldMap = 'getFields' in pageType && pageType.getFields();
    const fields = Object.keys(fieldMap).map(k => fieldMap[k])
    const expanded = {}
    const selected = {}

</script>


<style>
    .button {
        text-decoration: none;
        color: var(--green-glitter);
        cursor: pointer;
    }


    li {
        list-style-type: none;
    }

    li.selected {
        font-weight: bold;
    }

    li.not-selected {
        font-weight: normal;
    }

    .button:hover {
        background-color: var(--loon-turquoise);
    }
</style>


<svelte:head>
    <title>
        Query builder
    </title>
</svelte:head>


{#if fields}
    <ul>
        {#each fields as field}
            <li class="{selected[field.name] ? 'selected' : 'not-selected'}">
                {#if expanded[field.name]}
                    <div
                        class='button'
                        on:click="{(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            expanded[field.name] = false
                        }}"
                    >
                        <span
                            on:click="{(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                selected[field.name] = !selected[field.name]
                            }}"
                        >
                            [{selected[field.name] ? 'x' : ' '}]
                        </span>
                        {' '}v {field.name} {field.type}
                    </div>
                    <svelte:self
                        typeName={resolvesTo(field.type)}
                        introspectionQuery={introspectionQuery}
                        rootPath={''}
                        on:selected="{value => {
                            selected[field.name] = value.detail;

                            dispatch(
                                'selected',
                                Array.from(Object.values(selected)).some(v => !!v)
                            )
                        }}"
                    />
                {:else if resolvesToScalarType(field.type)}
                    <div
                        class='button'
                        on:click="{(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            selected[field.name] = !selected[field.name]
                            dispatch(
                                'selected',
                                Array.from(Object.values(selected)).some(v => !!v)
                            )
                        }}"
                    >
                        <span>
                            [{selected[field.name] ? 'x' : ' '}]
                        </span> - {field.name} {field.type}</div>
                {:else}
                    <div
                        class='button'
                        on:click="{(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            expanded[field.name] = true
                        }}"
                    ><span>
                    [{selected[field.name] ? 'x' : ' '}]
                </span> > {field.name} {field.type}</div>
                {/if}
            </li>
        {/each}
    </ul>
{/if}