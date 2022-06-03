import type {
    GraphQLInterfaceType,
    GraphQLObjectType,
    GraphQLEnumValue,
    GraphQLInputField,
    GraphQLField,
} from 'graphql'

export type DocumentationProps = {
    pageKind: 'type'
    possibleTypes?: {
        typeName: string;
        typeDescription: string;
    }[];
    possibleValues?: readonly GraphQLEnumValue[];
    implementions?: {
        typeName: string;
        typeDescription: string;
    }[];
    implements?: {
        typeName: string;
        typeDescription: string;
    }[]
    name: string;
    fields: {
        name: string;
        typeName: string;
        typeLinkDescription: string;
        description: string;
        args?: {
            name: string;
            description: string;
        }[]
    }[];
    description: string;
    title: string;
} | {
    pageKind: 'root'
    title: string;
    description: string;
    mutationType?: {
        typeName: string;
        description: string;
    };
    queryType?: {
        typeName: string;
        description: string;
    };
    subscriptionType?: {
        typeName: string;
        description: string;
    };
}