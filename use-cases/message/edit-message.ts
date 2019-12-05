import { Db } from 'mongodb';
import { AsyncFunction } from '../../types';
import { IdService } from '../../Id';


export function buildEditMessage(
    getDb: AsyncFunction<Db>,
    Id: IdService,
    sanitize
) {
    return async function editMessage({id, message}) {
        if (!id || !Id.isValidId(id)) {
            throw Error('Message id is not provided or is not valid.');
        }

        const sanitizedMessage = sanitize(message);

        if (!sanitizedMessage) {
            throw new Error('Message must have useful text.');
        }

        const db = await getDb();
        const messagesCollection = db.collection('messages');

        return await messagesCollection.findOneAndUpdate(
            {_id: id},
            { $set: { content: sanitizedMessage, modifiedOn: Date.now(), edited: true }},
            { returnOriginal: false }
            );

    }
}