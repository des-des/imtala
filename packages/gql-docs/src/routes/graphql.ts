/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post({ body }) {

    const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        body: body.query,
        headers: {
            'content-type': 'application/graphql'
        }
    });

    const payload = await response.json()

    if (payload.errors) {
        console.log({body})
        for (let error of payload.errors) {
            console.error(error)
        }
    }


    return {
        body: payload.data,
        status: response.status,
        headers: {
            ['content-type']: 'application/json',
        }
    };
	
}
