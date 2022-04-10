import { SvelteComponentTyped } from "svelte";
import type { FieldNode, GraphQLField, GraphQLInputType, ObjectValueNode } from "graphql";
declare const __propDef: {
    props: {
        astParent: ObjectValueNode | FieldNode;
        schema: GraphQLInputType | GraphQLField<any, any, any>;
        fieldName: string;
    };
    events: {
        click: MouseEvent;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type QueryArgumentEditorProps = typeof __propDef.props;
export declare type QueryArgumentEditorEvents = typeof __propDef.events;
export declare type QueryArgumentEditorSlots = typeof __propDef.slots;
export default class QueryArgumentEditor extends SvelteComponentTyped<QueryArgumentEditorProps, QueryArgumentEditorEvents, QueryArgumentEditorSlots> {
}
export {};
