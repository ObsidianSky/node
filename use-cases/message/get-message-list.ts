import { AsyncFunction } from '../../types';
import { Db } from 'mongodb';

export function buildGetMessageList(getDb: AsyncFunction<Db>) {
    return async function getMessageList({chatId}) {
        const db = await getDb();
        const messagesCollection = db.collection('messages');

        return await messagesCollection.find({chatId: chatId}).toArray();
    }
}