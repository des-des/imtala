import { GraphQLUnionType, GraphQLInterfaceType, GraphQLObjectType, GraphQLEnumType, buildClientSchema, } from 'graphql';
export let typeName = undefined;
export let introspectionQuery;
const buildProps = ({ introspectionQuery, typeName }) => {
    const schema = buildClientSchema(introspectionQuery);
    const queryType = schema.getQueryType();
    const mutationType = schema.getMutationType();
    const subscriptionType = schema.getSubscriptionType();
    const pageType = typeName && schema.getType(typeName);
    const fieldMap = pageType && 'getFields' in pageType && pageType.getFields();
    const fields = fieldMap && Object.keys(fieldMap).map(k => fieldMap[k]);
    const title = typeof typeName === 'string' ? typeName : 'Root types';
    const possibleTypes = (pageType instanceof GraphQLUnionType || pageType instanceof GraphQLInterfaceType) && schema.getPossibleTypes(pageType);
    return {
        queryType,
        mutationType,
        subscriptionType,
        pageType,
        fieldMap,
        fields,
        title,
        description: schema.description,
        typeName,
        possibleTypes
    };
};
export default buildProps;
