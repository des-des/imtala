import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import type { Connection } from '@imtala/svelte-components/api/db'
import { connectionStore } from '@imtala/svelte-components/api/db'

console.log('RUNNING INIT DB')

const save = ({
    connections,
}: {
    connections: Map<string, Connection>,
}) => {
    fs.writeFileSync(`${SAVE_FOLDER_PATH}/connections.json`, JSON.stringify(Array.from(connections.values()), null, 4))
}

const fetchDataDirectory = () => {
    if (import.meta.env && import.meta.env.VITE_IMTALA_DATA_DIRECTORY) {
        return import.meta.env && import.meta.env.VITE_IMTALA_DATA_DIRECTORY
    }

    if (process.env.IMTALA_DATA_DIRECTORY) {
        return process.env.IMTALA_DATA_DIRECTORY;
    }

    return `${os.homedir()}/.imtala`
}

const SAVE_FOLDER_PATH = fetchDataDirectory()
console.log('Config will be persisted to', path.resolve(SAVE_FOLDER_PATH))



const init = (): Map<string, Connection> => {
    if (!fs.existsSync(SAVE_FOLDER_PATH)) {
        fs.mkdirSync(SAVE_FOLDER_PATH)
    }

    if (!fs.existsSync(`${SAVE_FOLDER_PATH}/connections.json`)) {
        return new Map<string, Connection>()
    }

    const savedConnections = JSON.parse(fs.readFileSync(`${SAVE_FOLDER_PATH}/connections.json`).toString()) as Connection[]

    return new Map(savedConnections.map(connection => ([connection.name, connection])))
}

connectionStore.start(init, save)