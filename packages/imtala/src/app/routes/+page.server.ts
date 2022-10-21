import { error } from '@sveltejs/kit';
 
import type { PageServerLoad } from './$types';
import {getUserFromSession} from '../lib/user'
import getStore from '../lib/store'


export const load: PageServerLoad = async ({ cookies }) => {
  const {connection: connectionStore} = await getStore()
  const user = await getUserFromSession(cookies);
  return {
    user,
    connections: user && await (await connectionStore.list()).filter(connection => connection.userId === user.userId) || []
  }
}