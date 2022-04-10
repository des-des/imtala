import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        typeName?: string;
        introspectionQuery: any;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type GqlDocumentationProps = typeof __propDef.props;
export declare type GqlDocumentationEvents = typeof __propDef.events;
export declare type GqlDocumentationSlots = typeof __propDef.slots;
export default class GqlDocumentation extends SvelteComponentTyped<GqlDocumentationProps, GqlDocumentationEvents, GqlDocumentationSlots> {
}
export {};
