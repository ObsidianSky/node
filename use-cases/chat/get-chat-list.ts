import { AsyncFunction } from '../../types';
import { Db } from 'mongodb';
import { IdService } from '../../Id';

export function buildGetChatList(getDb: AsyncFunction<Db>, Id: IdService) {
    return async function getChatList({memberId}) {

        if (!Id.isValidId(memberId)) {
            throw Error('Member id ' + memberId + ' is not valid.');
        }

        const db = await getDb();
        const chatCollection = db.collection('chats');

        return await chatCollection.find({members: memberId}).toArray();
    }
}