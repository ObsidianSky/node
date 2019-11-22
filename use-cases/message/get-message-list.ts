import { AsyncFunction } from '../../types';
import { Db } from 'mongodb';

export function buildGetMessageList(getDb: AsyncFunction<Db>) {
    return async function getMessageList({chatId}) {
        const db = await getDb();
        const messagesCollection = db.collection('messages');

        return await messagesCollection.aggregate([
            {
                $match: {chatId: chatId}
            },
            {
                $lookup: {
                    from: "users",
                    let: {authorId: "$authorId"},
                    pipeline: [
                        {
                            $match:
                                {
                                    $expr:

                                        {$eq: [ "$_id", "$$authorId" ]},


                                }
                        },
                        {
                            $project: { _id: 1, name: 1, email: 1 }
                        }
                    ],
                    as: "author"
                }
            },
            { $unwind : "$author" }
        ]).toArray();

        // return await messagesCollection.find({chatId: chatId}).toArray();
    }
}