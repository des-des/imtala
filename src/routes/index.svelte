<script context='module'>
    // export const prerender = true;
    import {
        getIntrospectionQuery,
        buildClientSchema
    } from 'graphql';

    import { GraphQLClient } from 'graphql-request'

    const introspectionQuery = getIntrospectionQuery()

    /** @type {import('@sveltejs/kit').Load} */
	export async function load({ page, fetch, session, stuff }) {
        const client = new GraphQLClient('/graphql', { fetch })

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
            return {
                error
            }
        }
        
    }
</script>

<script>
    import TypeLink from '../lib/TypeLink.svelte'
	export let introspectionQueryResponse;
    export let schema = buildClientSchema(introspectionQueryResponse)
    const queryType = schema && schema.getQueryType();
</script>

<p>
    {schema.description ||
        'A GraphQL schema provides a root type for each kind of operation.'}
</p>

<h2>
    root types
</h2>

<TypeLink type={queryType} />
