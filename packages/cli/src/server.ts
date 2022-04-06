import * as fs from 'fs'
import * as path from 'path'
import Koa from 'koa'
import { handler } from '../client/handler.js';
import c2k from 'koa-connect';
interface ServerConfig {
    cliConfig: any;
    port: number;
}

export const start = (opts: ServerConfig) => {

    const app = new Koa()

      app.use(async (ctx, next) => {
          if (ctx.url.includes('/cli-config.json') && ctx.method === 'GET') {
              ctx.body = opts.cliConfig
          } else {
            await next();

          }
      })

      app.use(c2k(handler))

      
      app.listen(opts.port, () => {
          console.log(`listening on ${opts.port}`)
      });
}