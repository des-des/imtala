<script >import { GraphQLList, GraphQLNonNull, } from 'graphql';
export let type;
</script>



{#if type instanceof GraphQLNonNull}
    <svelte:self type={type.ofType}/>!
{:else if type instanceof GraphQLList}
    [<svelte:self type={type.ofType}/>]
{:else}
<a href={`${type.name}`}>{type.name}</a>
{/if}