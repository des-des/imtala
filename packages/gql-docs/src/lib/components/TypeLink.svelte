<script lang="ts">
    import {
        GraphQLList,
        GraphQLNonNull,
        GraphQLType,
    } from 'graphql';

    export let type: GraphQLType | null | undefined;
    export let rootPath: string;
</script>



{#if type instanceof GraphQLNonNull}
    <svelte:self type={type.ofType} rootPath={rootPath}/>!
{:else if type instanceof GraphQLList}
    [<svelte:self type={type.ofType} rootPath={rootPath}/>]
{:else}
<a href={`${rootPath}/${type.name}`}>{type.name}</a>
{/if}