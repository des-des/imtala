import { SvelteComponentTyped } from "svelte";
import type { GraphQLType } from 'graphql';
declare const __propDef: {
    props: {
        type: GraphQLType | null | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type TypeLinkProps = typeof __propDef.props;
export declare type TypeLinkEvents = typeof __propDef.events;
export declare type TypeLinkSlots = typeof __propDef.slots;
export default class TypeLink extends SvelteComponentTyped<TypeLinkProps, TypeLinkEvents, TypeLinkSlots> {
}
export {};
