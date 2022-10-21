import {promises as fs} from 'node:fs'
import * as path from 'path'
import * as os from 'os'
import fs2 from 'node:fs'

fs2.readFile


interface Model <T> {
    get: (key: string) => Promise<T | undefined >
    remove: (key: string) => Promise<void>
    list: () => Promise<T[]>
    set: (key: string, value: T) => Promise<void>
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


const ensureModelDir = async (modelName: string) => {
    const dirPath = `${SAVE_FOLDER_PATH}/${modelName}`
    await fs.mkdir(dirPath, {recursive: true})

    return dirPath
}

type ArbitraryObject = { [key: string]: unknown; };

function isArbitraryObject(potentialObject: unknown): potentialObject is ArbitraryObject {
  return typeof potentialObject === "object" && potentialObject !== null;
}

interface ErrnoException extends Error {
    errno?: number | undefined;
    code?: string | undefined;
    path?: string | undefined;
    syscall?: string | undefined;
 }

function isErrnoException(error: unknown): error is ErrnoException {
    return isArbitraryObject(error) &&
      error instanceof Error &&
      (typeof error.errno === "number" || typeof error.errno === "undefined") &&
      (typeof error.code === "string" || typeof error.code === "undefined") &&
      (typeof error.path === "string" || typeof error.path === "undefined") &&
      (typeof error.syscall === "string" || typeof error.syscall === "undefined");
  }



const createFSModelStore = async<T>(modelName: string): Promise<Model<T>> => {
    const dirPath = await ensureModelDir(modelName);


    const get = async (key: string): Promise<T | undefined> => {
        try {
            return (JSON.parse(await fs.readFile(`${dirPath}/${key}.json`, 'utf8')))
        } catch (e) {
            if (isErrnoException(e) && e.code === 'ENOENT') {
                return;
            }

            throw e;
        }
    }

    const list = async (): Promise<T[]> => {
        const files = await fs.readdir(dirPath)

        const results = await Promise.all(files.map(file => get(file.split('.json')[0])))
        return results.filter((r): r is Awaited<T> => r !== undefined)
    }

    const set = async (key: string, doc: T): Promise<void> => {
        await fs.writeFile(`${dirPath}/${key}.json`, JSON.stringify(doc), 'utf8')
    }

    const remove = async (key: string): Promise<void> => {
        await fs.unlink(`${dirPath}/${key}.json`)
    }


    return {
        get,
        list,
        set,
        remove
    }
}

interface Session {
    userId: string;
    sessionId: string;
}

interface User {
    userId: string;
    fullName: string;
}

interface Connection {
    userId: string;
    connectionId: string;
    name: string;
    authMethodId: string;
}

interface AuthMethod {
    userId: string;
    authProviderType: string;
    token: string;
    identifier: string;
}

interface AuthProvider {
    type: 'github';
    name: string;
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
    loginUrl: string;
}

interface Config {
    deploymentType: 'local' | 'tenent' | 'sass'
}

interface Store {
    session: Model<Session>;
    config: Model<Config>;
    user: Model<User>;
    connection: Model<Connection>;
    authMethod: Model<AuthMethod>;
    authProvider: Model<AuthProvider>;
}

const createFSStore = async (): Promise<Store> => {
    return {
        session: await createFSModelStore<Session>('session'),
        config: await createFSModelStore<Config>('config'),
        user: await createFSModelStore<User>('user'),
        connection: await createFSModelStore<Connection>('connection'),
        authMethod: await createFSModelStore<AuthMethod>('authMethod'),
        authProvider: await createFSModelStore<AuthProvider>('authProvider')
    }
}

// TO FAR - this should be easy by now, is this pattern even needed with promises?
// const asyncFnQueue = <P, V>(registerInitHook: (callback: (e: (p: P) => Promise<V>) => void) => void): ((p: P) => Promise<V>) => {
//     let e: ((p: P) => Promise<V>) | undefined;
//     const q: {
//         res: (value: V | PromiseLike<V>) => void,
//         rej: (reason?: any) => void,
//         p: P
//     }[] = []

//     registerInitHook(exec => {
//         e = exec;
//         q.forEach(({res, rej, p}) => {
//             exec(p).then(res, rej)
//         })
//     })

//     return (p: P) => {
//         if (e) {
//             return e(p)
//         }

//         return new Promise((res, rej) => {
//             q.push({
//                 res,
//                 rej,
//                 p
//             })
//         })
//     }
// }


const store: {
    init: (createStore?: () => Promise<Store>) => Promise<Store>;
    getStore: () => Promise<Store>
} = (() => {
    let self: Promise<Store> | undefined;

    const init = async (createStore: () => Promise<Store> = createFSStore) => {
        self = createStore();
        return getStore()
    }

    const getStore = async () => {
        if (!self) {
            throw new Error('must init store before use')
        }

        return self
    }

    return {
        init,
        getStore
    }
})()

export default store;