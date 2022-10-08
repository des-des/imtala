import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import type { Connection, Page } from '@imtala/svelte-components/api/db'
import { connectionStore, pageStore } from '@imtala/svelte-components/api/db'

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


const saveConnections = ({
    connections,
}: {
    connections: Map<string, Connection>,
}) => {
    fs.writeFileSync(`${SAVE_FOLDER_PATH}/connections.json`, JSON.stringify(Array.from(connections.values()), null, 4))
}


const savePages = ({
    pages,
}: {
    pages: Map<string, Page>,
}) => {
    fs.writeFileSync(`${SAVE_FOLDER_PATH}/pages.json`, JSON.stringify(Array.from(pages.values()), null, 4))
}


const initConnections = (): Map<string, Connection> => {
    if (!fs.existsSync(SAVE_FOLDER_PATH)) {
        fs.mkdirSync(SAVE_FOLDER_PATH)
    }

    if (!fs.existsSync(`${SAVE_FOLDER_PATH}/connections.json`)) {
        return new Map<string, Connection>()
    }

    const savedConnections = JSON.parse(fs.readFileSync(`${SAVE_FOLDER_PATH}/connections.json`).toString()) as Connection[]

    return new Map(savedConnections.map(connection => ([connection.name, connection])))
}

const initPages = (): Map<string, Page> => {
    if (!fs.existsSync(SAVE_FOLDER_PATH)) {
        fs.mkdirSync(SAVE_FOLDER_PATH)
    }

    if (!fs.existsSync(`${SAVE_FOLDER_PATH}/pages.json`)) {
        return new Map<string, Page>()
    }

    const savedPages = JSON.parse(fs.readFileSync(`${SAVE_FOLDER_PATH}/pages.json`).toString()) as Page[]

    return new Map(savedPages.map(page => ([page.name, page])))
}


connectionStore.start(initConnections, saveConnections)
pageStore.start(initPages, savePages)