import { program } from 'commander';
import * as fs from 'fs'
import * as path from 'path'
import { exec } from 'child_process';
import { dirname } from 'path';
import { fileURLToPath } from 'url';



program
    .name('imtala cli')
    .description('Interactive graphql client')
    .version('0.0.0')

program
    .command('codegen')
    .command('docs')
    .requiredOption('--introspection-file <filePath>', 'path of introspection file')
    .action((options) => {
        console.log('generating docs from introspection file at', options.introspectionFile)
        const __dirname = dirname(fileURLToPath(import.meta.url));
        fs.writeFileSync(
            path.join(__dirname, '..', 'routes', 'introspection.json'),
            fs.readFileSync(
                path.join(process.cwd(), options.introspectionFile)
            ),
        )

        fs.writeFileSync(
            path.join(__dirname, '..', '..', 'cli_config.json'),
            JSON.stringify({
                docsOnly: true
            }, null, 4)
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

program.parse();

const options = program.opts();
const limit = options.first ? 1 : undefined;
console.log(program.args[0].split(options.separator, limit));

export {}