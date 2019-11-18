import { AsyncFunction } from '../../types';
import { Db } from 'mongodb';
import { IdService } from '../../Id';

export function buildGetUser(getDb: AsyncFunction<Db>, Id: IdService) {
    return async function getUser(userId) {
        if (!userId || !Id.isValidId(userId)) {
            throw Error('User id is not provided or invalid.')
        }

        const db = await getDb();
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({_id: userId}, { projection: { salt: 0, passwordHash: 0} });

        if (!user) {
            throw Error(`User with id ${userId} was not found.`)
        }

        user.id = user._id;
        delete user._id;

        return user;
    }
}