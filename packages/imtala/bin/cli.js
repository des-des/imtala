#! /usr/bin/env node
import { Command } from 'commander'
import {handler} from '../build/handler.js';
const program = new Command();
import http from 'http'

program
  .name('imtala')
  .description('Graphql powered automation tooling')
  .version('0.8.0');

program.command('serve')
  .description('Start the imtala server')
  .option('-p, --port <number>', 'port', 3000)
  .action((options) => {
    const port = options.port;

    const server = http.createServer(handler);

    server.listen(port, () => {
        console.log(`Imtala running at http://localhost:${port}/`);
    });
  });

program.parse();