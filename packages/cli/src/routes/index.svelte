<!-- <script lang='ts'>
    import TypeLink from '@imtala/gql-docs/components/TypeLink.svelte'
    import introspectionStore from 'lib/introspectionQueryStore'
    import { getIntrospectionQuery } from 'graphql';


       /** @type {import('@sveltejs/kit').Load} */
	export async function load({ fetch }) {
        await introspectionStore.init(() =>
            fetch('/graphql', {
                method: 'GET',
                headers: {
                    'content-type': 'application/json'
                },
            })
        )

        return {
            props: {}
        }
    }
 
</script> -->

<!-- <TypeLink type='eoin' /> -->

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<a href='/docs/root'>docs</a>