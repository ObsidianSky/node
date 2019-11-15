import { Db } from 'mongodb';
import { AsyncFunction } from '../../types';
import makeChat from '../../entities/chat';


interface AddChatArguments {
    name: string,
    members: string[]
}

export function buildAddChat(
    getDb: AsyncFunction<Db>
) {
    return async function addChat({name, members} : AddChatArguments) {
        const chat = makeChat({name, members});

        const db = await getDb();

        const toInsert = {
            ...chat.asPlainObject(),
            _id: chat.getId()
        };

        return await db.collection('chats').insertOne(toInsert);

    }
}