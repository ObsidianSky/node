import { AsyncFunction } from '../../types';
import { Db } from 'mongodb';

export function buildGetUserList(getDb: AsyncFunction<Db>) {
    return async function getUserList() {
        const db = await getDb();
        const usersCollection = db.collection('users');

        return await usersCollection.find({}).toArray();
    }
}