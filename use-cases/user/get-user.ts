import { AsyncFunction } from '../../types';
import { Db } from 'mongodb';

export function buildGetUser(getDb: AsyncFunction<Db>) {
    return async function getUser({ userId }) {
        const db = await getDb();
        const usersCollection = db.collection('users');

        // TODO handle null result
        const res = await usersCollection.findOne({id: userId});

        console.log(res);

        return res;
    }
}