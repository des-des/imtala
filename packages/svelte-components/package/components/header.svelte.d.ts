import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        connectionRoot: string | undefined;
        activeNav: 'schema-exporer' | 'query-builder' | undefined;
        docRoot?: string;
        rootLinkName?: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type HeaderProps = typeof __propDef.props;
export declare type HeaderEvents = typeof __propDef.events;
export declare type HeaderSlots = typeof __propDef.slots;
export default class Header extends SvelteComponentTyped<HeaderProps, HeaderEvents, HeaderSlots> {
}
export {};
