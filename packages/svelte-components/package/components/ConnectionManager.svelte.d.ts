import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {};
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type ConnectionManagerProps = typeof __propDef.props;
export declare type ConnectionManagerEvents = typeof __propDef.events;
export declare type ConnectionManagerSlots = typeof __propDef.slots;
export default class ConnectionManager extends SvelteComponentTyped<ConnectionManagerProps, ConnectionManagerEvents, ConnectionManagerSlots> {
}
export {};
