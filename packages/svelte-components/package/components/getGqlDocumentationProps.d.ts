import { GraphQLObjectType, type GraphQLNamedType, type GraphQLInputFieldMap, type GraphQLFieldMap, type GraphQLInputField, type GraphQLField } from 'graphql';
export declare let typeName: string;
export declare let introspectionQuery: any;
export interface Props {
    queryType: GraphQLObjectType<any, any>;
    mutationType: GraphQLObjectType<any, any>;
    subscriptionType: GraphQLObjectType<any, any>;
    description: string;
    pageType: GraphQLNamedType;
    fieldMap: GraphQLInputFieldMap | GraphQLFieldMap<any, any>;
    fields: (GraphQLInputField | GraphQLField<any, any, any>)[];
    title: string;
    typeName: any;
    possibleTypes: readonly GraphQLObjectType<any, any>[];
}
declare const buildProps: ({ introspectionQuery, typeName }: {
    introspectionQuery: any;
    typeName?: string;
}) => Props;
export default buildProps;
