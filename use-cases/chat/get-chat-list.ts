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

        //todo pizdec prosto
        return await chatCollection.aggregate([
            {
                $match: {membersIds: memberId}
            },
            {
                $lookup: {
                    from: "users",
                    let: {membersIds: "$membersIds"},
                    pipeline: [
                        {
                            $match:
                                {
                                    $expr: {
                                        $and: [ { $in: [ "$_id", "$$membersIds" ] }, { $not:  [ { $eq: ['$_id', memberId] } ] } ]
                                    }
                                }
                        },
                        {
                            $project: {_id: 1, name: 1, email: 1}
                        },
                        {
                            $set: {id: "$_id"}
                        },
                        {
                            $unset: "_id"
                        }
                    ],
                    as: "members"
                },

            },
            {$unset: "membersIds"}
        ]).toArray();

        // return await chatCollection.find({members: memberId}).toArray();
    }
}