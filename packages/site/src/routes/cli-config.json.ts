import cliConfig from './cli_config.json'

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get() {
//     const shopify = await await fetch("https://graphql.myshopify.com/api/2022-04/graphql.json", {
//     "credentials": "omit",
//     "headers": {
//         "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:98.0) Gecko/20100101 Firefox/98.0",
//         "Accept": "*/*",
//         "Accept-Language": "en-GB,en;q=0.5",
//         "Content-Type": "application/json",
//         "X-Shopify-Storefront-Access-Token": "ecdc7f91ed0970e733268535c828fbbe",
//         "Sec-Fetch-Dest": "empty",
//         "Sec-Fetch-Mode": "cors",
//         "Sec-Fetch-Site": "cross-site",
//         "Pragma": "no-cache",
//         "Cache-Control": "no-cache"
//     },
//     "referrer": "https://shopify.dev/",
//     "body": "{\"query\":\"\\n    query IntrospectionQuery {\\n      __schema {\\n        \\n        queryType { name }\\n        mutationType { name }\\n        subscriptionType { name }\\n        types {\\n          ...FullType\\n        }\\n        directives {\\n          name\\n          description\\n          \\n          locations\\n          args {\\n            ...InputValue\\n          }\\n        }\\n      }\\n    }\\n\\n    fragment FullType on __Type {\\n      kind\\n      name\\n      description\\n      \\n      fields(includeDeprecated: true) {\\n        name\\n        description\\n        args {\\n          ...InputValue\\n        }\\n        type {\\n          ...TypeRef\\n        }\\n        isDeprecated\\n        deprecationReason\\n      }\\n      inputFields {\\n        ...InputValue\\n      }\\n      interfaces {\\n        ...TypeRef\\n      }\\n      enumValues(includeDeprecated: true) {\\n        name\\n        description\\n        isDeprecated\\n        deprecationReason\\n      }\\n      possibleTypes {\\n        ...TypeRef\\n      }\\n    }\\n\\n    fragment InputValue on __InputValue {\\n      name\\n      description\\n      type { ...TypeRef }\\n      defaultValue\\n      \\n      \\n    }\\n\\n    fragment TypeRef on __Type {\\n      kind\\n      name\\n      ofType {\\n        kind\\n        name\\n        ofType {\\n          kind\\n          name\\n          ofType {\\n            kind\\n            name\\n            ofType {\\n              kind\\n              name\\n              ofType {\\n                kind\\n                name\\n                ofType {\\n                  kind\\n                  name\\n                  ofType {\\n                    kind\\n                    name\\n                  }\\n                }\\n              }\\n            }\\n          }\\n        }\\n      }\\n    }\\n  \"}",
//     "method": "POST",
//     "mode": "cors"
// });

//     fs.writeFileSync('./shopify.json', JSON.stringify(await shopify.json(), null, 4))
    

    return {
        body: cliConfig,
        status: 200,
        headers: {
            ['content-type']: 'application/json',
        }
    };
}
