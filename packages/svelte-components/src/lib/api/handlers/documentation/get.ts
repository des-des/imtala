import {connectionStore} from '../../db'
import { parse } from 'cookie';

/** @type {import('./index').RequestHandler} */
const getDocumentationProps = async ({request, params}: {request: any, params: any}) => {
    const {connection: connectionName, typeName} = params
    const token = request.headers.get('cookie') && parse(request.headers.get('cookie'))[`imtala_${connectionName}`]
    const name = typeName === 'root' ? undefined : typeName

    // N.B. this will fail a required token is not provided

    const documentationProps = await connectionStore.getTypeDocumentation(connectionName, token, name)

    return {
        status: 200,
        headers: {
            ['content-type']: 'application/json',
        },
        body: {
            documentationProps,
            typeName: name,
            connectionName
        }
    }
}

export default getDocumentationProps