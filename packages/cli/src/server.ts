import * as fs from 'fs'
import * as path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';// import node adaptor
import Koa from 'koa'
import { handler } from '../client/handler.js';
import c2k from 'koa-connect';
const __dirname = dirname(fileURLToPath(import.meta.url));


interface ServerConfig {
    introspectionFilePath?: string;
    graphqlEndpoint?: string;
    graphqlEndpointHeaders?: string;
    port: number;
}

const createIntrospectionGetter = (opts: ServerConfig) => {
    if (opts.introspectionFilePath) {
        const introspection = JSON.parse(
            fs.readFileSync(
                path.join(process.cwd(), opts.introspectionFilePath)
            ).toString()
        )

        return async () => introspection;
    }

    if (!opts.graphqlEndpoint) {
        return;
        throw new Error('no way to get introspection!')

        return async () => {
            throw new Error('not implemented')
        }
    }
}


export const start = (opts: ServerConfig) => {
    const getIntrospection = createIntrospectionGetter(opts);

    const app = new Koa()

      app.use(c2k(handler))
      
      app.listen(opts.port, () => {
          console.log(`listening on ${opts.port}`)
      });
    // somehow we need to intercept the request for gql and use it here
    // then setup server, connect svelte
    
}