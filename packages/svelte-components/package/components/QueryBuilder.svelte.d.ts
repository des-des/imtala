import { SvelteComponentTyped } from "svelte";
import type { FieldNode, OperationDefinitionNode, GraphQLField } from 'graphql';
declare const __propDef: {
    props: {
        introspectionQuery: any;
        fieldName: string;
        schemaField: GraphQLField<any, any, any>;
        removeSelf: any;
        ast: FieldNode | OperationDefinitionNode;
        typeName?: string;
        isDocumentFocus?: boolean;
        setDocumentFocus?: (v: boolean) => void;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type QueryBuilderProps = typeof __propDef.props;
export declare type QueryBuilderEvents = typeof __propDef.events;
export declare type QueryBuilderSlots = typeof __propDef.slots;
export default class QueryBuilder extends SvelteComponentTyped<QueryBuilderProps, QueryBuilderEvents, QueryBuilderSlots> {
}
export {};
