import type { Connection } from '@imtala/svelte-components/api/db'
import { connectionStore } from '@imtala/svelte-components/api/db'
import savedConnections from '../../.imtala/connections.json'

const save = ({
    connections,
}: {
    connections: Map<string, Connection>,
}) => {};

const init = (): Map<string, Connection> => {
    return new Map((savedConnections as Connection[]).map(connection => ([connection.name, connection])))
}

connectionStore.start(init, save)