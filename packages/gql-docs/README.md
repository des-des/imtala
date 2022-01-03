# Graphql Documentation Creator

Easily create lightweight documentation for your Graphql API.

The resulting website has the following attributes
  - Fully static, which means you can host on any file server.
  - Each type document has its own rendered HTML document - Snappy and fast UI, good SEO & a low browser footprint.

This tool generates a static website - for every query, mutation or type in you schema a lightweight html page is created. Fast, simple and themeable.

## Usage

### Use as a svelte component
If you are using svelte and want to integrate gql docs into an existing website you can use the `GqlDocumentation` component exposed the the npm module: `@insola/gql-docs-svelte`

### Use as a cli tool
  - Raise an issue if you want to use this tool to create a static site without using svelte, Ill publish a cli tool that will wrap all this up and generate a static website.

<!-- ### Use as a cli tool
  1. Install either as a local module or globally - `npm i @insola/gql-docs-cli`
  2. Build your static documentation site.
  3. `insola-gql-docs-cli --output-directory documentation-website --introspection-source introspection-result.json` -->