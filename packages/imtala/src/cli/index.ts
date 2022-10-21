import { Command } from 'commander'
import { handler } from '../../build/handler.js';
const program = new Command();
import http from 'http'
import store from '../shared/store.js'

program
  .name('imtala')
  .description('Graphql powered automation tooling')
  .version('2.0.0');

program.command('serve')
  .description('Start the imtala server')
  .option('-p, --port <number>', 'port', '3000')
  .action(async (options) => {
    const port = options.port;

    const { config, authProvider } = await store.init()
    const domain = `http://localhost:${port}`
    const githubCallbackUrl = `${domain}/auth/callback/github`
    const githubLoginUrl = `https://github.com/login/oauth/authorize?client_id=be2b01287f154a3a973a&response_type=code&redirect_uri=${encodeURI(githubCallbackUrl)}`

    await config.set('global', {
      deploymentType: 'local'
    })
    await authProvider.set('github', {
      name: 'github',
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackUrl: githubCallbackUrl,
      loginUrl: githubLoginUrl,
      type: 'github',
    })

    console.log(await config.get('global'))


    const server = http.createServer(handler as any);

    server.listen(port, () => {
      console.log(`Imtala running at ${domain}`);
    });
  });

program.parse();