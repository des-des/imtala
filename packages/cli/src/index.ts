#!/usr/bin/env node

import { program } from 'commander';
import { exec } from 'child_process';
import {start} from './server.js'
import buildClient, {createCliConfig} from '@imtala/client/entrypoints/buildClient.js'


program
    .name('imtala')
    .description('Interactive graphql client')
    .version('1.1.0')

program
    .command('gen-docs')
    .description('Use an introspection query result to generate a static website for your graphql api')
    .requiredOption('--introspection-file <filePath>', 'path of introspection file')
    .action((options) => {

        buildClient({
          buildMode: 'documentation',
          introspectionFilePath: options.introspectionFile,
          svelteCommand: 'build'
        }).then(({outputDirectory}) => {
          exec(`cp -r ${outputDirectory} ./imtala-docs`, (error, stdout, stderr) => {
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
    })

program
    .command('serve')
    .description('Serve the graphql client on localhost')
    .option('-F, --introspection-file <filePath>', 'path of introspection file')
    .option('-P, --port <port>', 'port to listen on')
    // .option('-E, --gql-endpoint <url>', 'url of target graphql endpoint')
    // .option('-H, --gql-endpoint-headers <headers>', 'headers to attach to requests to the gql endpoint')
    .action((options) => {
        const cliConfig = createCliConfig('client', options.introspectionFile)

        const port = options.port ? parseInt(options.port, 10) : 3000
        start({port, cliConfig})
    })

program.parse();

export {}