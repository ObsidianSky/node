import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'chat-test';

const client = new MongoClient(url, { useNewUrlParser: true });

export default async function getDb () {
    if (!client.isConnected()) {
        await client.connect()
    }

    return client.db(dbName)
}
