import getStore from '../../../../lib/store';
import { randomBytes } from 'crypto';

import type { PageServerLoad } from './$types'
import { redirect, error } from '@sveltejs/kit';

const createId = (bytes: number): Promise<string> => new Promise((res, rej) => {
  randomBytes(bytes, (err, buf) => {
    if (err) return rej(err)

    res(buf.toString('base64url'))
  })
})

export const load: PageServerLoad = async ({ params, cookies, url }) => {
  const { providerName } = params;
  const {
    connection: connectionStore,
    authMethod: authMethodStore,
    user: userStore,
    session: sessionStore,
    authProvider: authProviderStore
  } = await getStore()

  const authProvider = await authProviderStore.get(providerName)

  if (!authProvider) {
    throw error(403, 'forbidden')
  }

  const accessTokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      ['Content-Type']: 'application/json',
    },
    body: JSON.stringify({
      client_id: authProvider.clientId,
      client_secret: authProvider.clientSecret,
      code: url.searchParams.get('code'),
      response_type: 'code',
      grant_type: 'authorization_code',
      redirect_uri: authProvider.callbackUrl
    })
  })


  const accessTokenResponsePayload = await accessTokenResponse.json();
  const token = accessTokenResponsePayload.access_token;

  const ghUserResponse = await fetch('https://api.github.com/user', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const userData = await ghUserResponse.json()

  const authMethods = await authMethodStore.list();
  const authMethod = authMethods
    .filter(authMethod => authMethod.authProviderType === providerName)
    .find(authMethod => authMethod.identifier === userData.id)

  if (authMethod) {
    // login flow
    const sessionId = await createId(24)

    await sessionStore.set(sessionId, {
      userId: authMethod.userId,
      sessionId
    })

    cookies.set('imtala_session_id', sessionId, { path: '/' })

    throw redirect(303, '/')
  }

  // signup & create connection flow

  const connectionId = await createId(24)
  const userId = await createId(24)
  const authMethodId = await createId(24)
  const sessionId = await createId(24)


  await authMethodStore.set(userData.id, {
    identifier: userData.id,
    authProviderType: 'github',
    userId: userId,
    token
  })

  await connectionStore.set(connectionId, {
    name: providerName,
    connectionId,
    userId,
    authMethodId
  })

  await userStore.set(userId, {
    fullName: userData.name,
    userId
  })

  await sessionStore.set(sessionId, {
    userId: userId,
    sessionId
  })

  cookies.set('imtala_session_id', sessionId, { path: '/' })

  throw redirect(303, '/')

}
