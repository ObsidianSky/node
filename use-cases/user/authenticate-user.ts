import { Db } from 'mongodb';

function throwGenericAuthenticationError() {
    throw Error(`Invalid email or password`);
}

export function buildAuthenticateUser(getDb: () => Promise<Db>, scryptPassword, signToken) {
    return async function authenticateUser({email, password}) {
        const db = await getDb();

        const user = await db.collection('users').findOne({ email: email });

        if (!user || scryptPassword(password, user.salt) !== user.passwordHash) {
            throwGenericAuthenticationError();
        }

        // TODO think do we need here makeUser object
        return {
            token: signToken({ email: user.email, id: user.id}),
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        };
    }
}