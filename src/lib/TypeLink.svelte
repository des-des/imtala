<script lang="ts">
    import {
        GraphQLList,
        GraphQLNonNull,
        GraphQLType,
    } from 'graphql';

    export let type: GraphQLType | null | undefined;
</script>

<style>
    a {
        text-decoration: none;
        color: var(--green-glitter)
    }

    a:visited {
        color: var(--endo);
    }

    a:hover {
        background-color: var(--loon-turquoise);
    }
</style>



{#if type instanceof GraphQLNonNull}
    <svelte:self type={type.ofType} />!
{:else if type instanceof GraphQLList}
    [<svelte:self type={type.ofType} />]
{:else}
<a href={`/type/${type.name}/`}>{type.name}</a>
<!-- <span>tmp</span> -->
{/if}