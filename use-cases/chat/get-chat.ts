import { AsyncFunction } from '../../types';
import { Db } from 'mongodb';
import { IdService } from '../../Id';

export function buildGetChat(getDb: AsyncFunction<Db>, Id: IdService) {
    return async function getChat({chatId}) {

        if (!Id.isValidId(chatId)) {
            throw Error('Chat id ' + chatId + ' is not valid.');
        }

        const db = await getDb();
        const chatCollection = db.collection('chats');

        return await chatCollection.findOne({_id: chatId});
    }
}