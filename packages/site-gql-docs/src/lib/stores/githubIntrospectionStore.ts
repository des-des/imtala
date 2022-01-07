import { createQueryStore } from '@imtala/gql-docs';
export type { StoreState } from '@imtala/gql-docs/stores/createIntrospectionQueryStore.js';

const githubIntrospectionStore = createQueryStore();

export default githubIntrospectionStore;
