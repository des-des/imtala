import type { Cookies } from '@sveltejs/kit'
import getStore from './store'

export const getUserFromSession = async (cookies: Cookies) => {
  const sessionKey = cookies.get('imtala_session_id')
  if (!sessionKey) return;

  const {session: sessionStore, user: userStore} = await getStore()

  const session = await sessionStore.get(sessionKey)

  if (!session) return;

  return userStore.get(session.userId)
}