import makeMessage from '../../entities/message';
import { Db } from 'mongodb';
import { AsyncFunction } from '../../types';


export function buildAddMessage(
    getDb: AsyncFunction<Db>
) {
    return async function addMessage(messageInfo) {
        const message = makeMessage(messageInfo);

        const db = await getDb();
        const messagesCollection = db.collection('messages');

        return await messagesCollection.insertOne({
            ...message.asPlainObject(),
            _id: message.getId()
        });

    }
}