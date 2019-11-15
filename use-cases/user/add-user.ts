import makeUser from '../../entities/user';
import { Db } from 'mongodb';
import { AsyncFunction } from '../../types';

export function buildAddUser(
    detDb: AsyncFunction<Db>,
    getSalt,
    scryptPassword: (p: string, s:string) => string
) {
    return async function addUser(userInfo) {
        if (!userInfo.password) {
            throw Error(`Password is not provided`);
        }

        const user = makeUser(userInfo);

        const db = await detDb();
        const existedUser = await db.collection('users').findOne({ email: user.getEmail()});

        if (existedUser) {
            throw Error(`User with email ${user.getEmail()} already exists`);
        }

        const salt = getSalt();
        const passwordHash = scryptPassword(userInfo.password, salt);

        return await db.collection('users').insertOne({
            _id: user.getId(),
            passwordHash: passwordHash,
            salt: salt,
            name: user.getName(),
            email: user.getEmail(),
            bio: user.getBio(),
            friendsIds: user.getFriendsIds(),
            chatsIds: user.getChatsIds(),
            lastActivity: user.getLastActivity()
        });
    }
}