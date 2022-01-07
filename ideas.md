Build a UI on a saved query.
  - Look at query return type to build tokens
  - low code option
    - Something you import into svelte kit
    - Something that bundles svelte kit
      - define query (#query builder!)
      - Now we have return type
      - build page from return type
        - Using a form
          - Check or uncheck each value
        - dnd
          - layouts
          - Rich text
          - text
          - notion?
        - can we have a github example? Or another API, something no code, ie notion, airtable .. What has a graphql api & is popular!
    - some kind of graphql client that can be used with svelte kit (&others)?
    - how can this compliment docs
      - so maybe we have a documentation component and a views component
      - what would views component do?
        - define query
        - get types
        - define views UGH!

query builder
  - Query builder builder - low code tool, maps some kind of form to a gql query.
    - Outputs
      - Natural language. `All employees who` `are in the team` `tech` .. ? Could be cool to explore how we could auto generate this with postgraphile ..
      - Form, ie input boxes, checkboxes & dropdowns