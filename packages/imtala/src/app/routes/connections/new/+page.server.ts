import type { PageServerLoad } from './$types';
import getStore from '../../../lib/store'


export const load: PageServerLoad = async () => {
  const {authProvider: authProviderStore} = await getStore()
  return {
    providers: await authProviderStore.list(),
  }
}