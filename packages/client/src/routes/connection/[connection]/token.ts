
export async function post({ request }) {
    const { clientId, clientSecret, code }: {
        code: string;
        clientSecret: string;
        clientId: string;
    } = await request.json()

    const accessTokenResponse = await fetch(`https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        }
    })

    const {
        access_token: accessToken
    } = await accessTokenResponse.json()


    return {
        body: {
            accessToken
        },
        status: 200,
        headers: {
            ['content-type']: 'application/json',
        }
    }
}