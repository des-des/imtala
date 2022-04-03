<script lang="ts">
    import {
        GraphQLList,
        GraphQLNonNull,
    } from 'graphql';

    import type {
        GraphQLType,
    } from 'graphql';

    export let type: GraphQLType | null | undefined;
</script>



{#if type instanceof GraphQLNonNull}
    <svelte:self type={type.ofType}/>!
{:else if type instanceof GraphQLList}
    [<svelte:self type={type.ofType}/>]
{:else}
<a href={`${type.name}`}>{type.name}</a>
{/if}