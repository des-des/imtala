#!/usr/bin/env node

import { program } from 'commander';
import * as fs from 'fs'
import * as path from 'path'
import { exec } from 'child_process';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import {start} from './server.js'

type SvelteBuildMode = 'static-docs' | 'server'


program
    .name('imtala')
    .description('Interactive graphql client')
    .version('0.0.0')

program
    .command('gen-docs')
    .description('Use an introspection query result to generate a static website for your graphql api')
    .requiredOption('--introspection-file <filePath>', 'path of introspection file')
    .action((options) => {
        const __dirname = dirname(fileURLToPath(import.meta.url));
        fs.writeFileSync(
            path.join(__dirname, '..','..', 'src', 'routes', 'introspection.json'),
            fs.readFileSync(
                path.join(process.cwd(), options.introspectionFile)
            ),
        )

        fs.writeFileSync(
            path.join(__dirname, '..', '..', '.build_mode'),
            'gen-docs'
        )

        exec('./node_modules/.bin/svelte-kit build', (error, stdout, stderr) => {
            if (error) {
              console.error(`error: ${error.message}`);
              return;
            }
          
            if (stderr) {
              console.error(`stderr: ${stderr}`);
              return;
            }
          
            console.log(`stdout:\n${stdout}`);
          });
          
    })

program
    .command('serve')
    .description('Serve the graphql client on localhost')
    .requiredOption('-F, --introspection-file <filePath>', 'path of introspection file')
    .option('-P, --port <port>', 'port to listen on')
    // .option('-E, --gql-endpoint <url>', 'url of target graphql endpoint')
    // .option('-H, --gql-endpoint-headers <headers>', 'headers to attach to requests to the gql endpoint')
    .action((options) => {
        const __dirname = dirname(fileURLToPath(import.meta.url));
        // ugh
        fs.writeFileSync(
            path.join(__dirname, '..','..', 'client', 'server', 'entries', 'endpoints', 'introspection.json'),
            fs.readFileSync(
                path.join(process.cwd(), options.introspectionFile)
            ),
        )

        fs.writeFileSync(
            path.join(__dirname, '..', '..', 'cli_config.json'),
            JSON.stringify({
                svelteBuildMode: 'server'
            }, null, 4)
        )

        const port = options.port ? parseInt(options.port, 10) : 3000
        start({port})
    })

program.parse();

const options = program.opts();
const limit = options.first ? 1 : undefined;

export {}