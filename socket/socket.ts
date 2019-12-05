import { getUser } from '../use-cases/user';
import { getChat, getChatsList } from '../use-cases/chat';
import { addMessage, editMessage } from '../use-cases/message';

export const socketServer = require('http').createServer();
const io = require('socket.io')(socketServer);


const connections = {};

io.on('connection', async (socket) => {
    const userId = socket.handshake.query.userId;

    connections[userId] = socket;

    const user = await getUser({userId});

    socket.on('message', async data => {
        console.dir(data);
        await handleMessage(data, user);
    });

    const chatList = await getChatsList({memberId: userId});

    const allChatsMembers = chatList.reduce((accum, chat) => {
        return accum.concat(chat.members.map(member => member.id));
    }, []);

    const uniqueChatMembers = Array.from(new Set(allChatsMembers));

    notifyAboutOnline(uniqueChatMembers, connections, socket, userId);

    socket.on('disconnect', () => {
        notifyAboutOffline(uniqueChatMembers, connections, userId);
        delete connections[userId];
    });
});

function notifyAboutOnline(membersToCheck, connections, userSocket, userId) {
    membersToCheck.forEach((memberId: string) => {
        const memberSocket = connections[memberId];

        if (memberSocket) {
            userSocket.send('message', {
                type: 'USER_ONLINE',
                payload: memberId
            });

            memberSocket.send('message', {
                type: 'USER_ONLINE',
                payload: userId
            })
        }
    });
}

function notifyAboutOffline(membersToCheck, connections, userId) {
    membersToCheck.forEach((memberId: string) => {
        const memberSocket = connections[memberId];

        if (memberSocket) {
            memberSocket.send('message', {
                type: 'USER_OFFLINE',
                payload: userId
            })
        }
    });
}

// TODO bullshit going on her
async function handleMessage(data: { type: string, payload: any }, user) {
    switch (data.type) {
        case 'EDIT_MESSAGE':
            await handleEditMessage(data.payload, user);
            break;
        case 'NEW_MESSAGE':
            await handleNewMessage(data.payload, user);
            break;
        default:
            console.log('No action for type ' + data.type);
    }
}

async function handleEditMessage(payload: {message: string, id: string}, user) {
    let message;

    try {
        message = await editMessage(payload);
    } catch (e) {
        console.error(e);
    }

    if (!message.value) return;

    const author = {
        id: user.id,
        name: user.name,
        email: user.email
    };

    const chat = await getChat({chatId: message.value.chatId});

    chat.membersIds.forEach((memberId) => {
        const memberSocket = connections[memberId];

        if (memberSocket) {
            memberSocket.send('message', {
                type: 'EDIT_MESSAGE',
                payload: { ...message.value, author }
            })
        }
    })
}

async function handleNewMessage(payload: {message: string, chatId: string}, user) {
    let message;

    try {
        message = await addMessage({authorId: user.id, chatId: payload.chatId, content: payload.message });
    } catch (e) {
        console.error(e);
    }

    if (!message) return;

    const author = {
        id: user.id,
        name: user.name,
        email: user.email
    };

    const chat = await getChat({chatId: payload.chatId});

    chat.membersIds.forEach((memberId) => {
        const memberSocket = connections[memberId];

        if (memberSocket) {
            memberSocket.send('message', {
                type: 'NEW_MESSAGE',
                payload: { ...message, author }
            })
        }
    })
}