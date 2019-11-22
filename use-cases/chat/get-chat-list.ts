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

        return await chatCollection.aggregate([
            {
                $match: {members: memberId}
            },
            {
                $lookup: {
                    from: "users",
                    let: {members: "$members"},
                    pipeline: [
                        {
                            $match:
                                {
                                    $expr:

                                        {$in: [ "$_id", "$$members" ]},


                                }
                        },
                        {
                            $project: { _id: 1, name: 1, email: 1 }
                        }
                    ],
                    as: "author"
                }
            },
            // { $unwind : "$author" }
        ]).toArray();

        // return await chatCollection.find({members: memberId}).toArray();
    }
}