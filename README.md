# imtala cli

Imtala in an interactive graphql client. It started as fun way to learn svelte and dig a little deeper into graphql, but I found the resulting tool to have a nicer interface than the reference graphiql implementation floating around.
  - Tiny package & ssr - snappy load and interaction, low memory footprint 
  - Site generation - this tool can also create a lightweight static website to hold documentation, each gql type has its own html file weighing in at ~ 2kb.
  - The tree explorer / query builder interface feels less fiddly and easier to traverse than the one that comes with graphql. Have a go and let me know what you think.
  - The next piece of this is having it run in the background and hold connection information for multiple apis (staging / prod), and allow things like two factor auth, or fetching access tokens.


There is a live example om the [website](https://imtala.com/).

## Usage

### Installation

You can install using npm or another package manager.

With npm, install globally with
```
npm i -g @imtala/cli
```

or locally with

```
npm i @imtala/cli
```

## Usage

Start imtala with the command `imtala serve`, or run `imtala help` for commands and usage.

Once you have started imtala, access the web client using a browser. From here you can add and configure connections. You can also use the cli to preload an introspection file, or generate a static documentation site.

### `imtala help`

```
Usage: imtala [options] [command]

Interactive graphql client

Options:
  -V, --version       output the version number
  -h, --help          display help for command

Commands:
  gen-docs [options]
  serve [options]
  help [command]      display help for command
```

### `imtala help serve`
```
Usage: imtala serve [options]

Serve the graphql client on localhost

Options:
  -F, --introspection-file <filePath>  path of introspection file
  -P, --port <port>                    port to listen on
  -h, --help                           display help for command
```

### `imtala help gen-docs`
```
Usage: imtala gen-docs [options]

Use an introspection query result to generate a static website for your graphql api

Options:
  --introspection-file <filePath>  path of introspection file
  -h, --help                       display help for command
```


Follow my [twitter](https://twitter.com/eoin_des_des) for updates, or check back here.
