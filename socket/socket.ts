import { getUser } from '../use-cases/user';
import { getChat, getChatsList } from '../use-cases/chat';
import { addMessage } from '../use-cases/message';

export const socketServer = require('http').createServer();
const io = require('socket.io')(socketServer);


const connections = {};

io.on('connection', async (socket) => {
    const userId = socket.handshake.query.userId;

    connections[userId] = socket;

    const user = await getUser({userId});

    socket.on('message', async data => {
        await handleChatMessage(data.payload, user);
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

// TODO bullshit
async function handleChatMessage(data: {message: string, chatId: string}, user) {
    let message;

    try {
        message = await addMessage({authorId: user.id, chatId: data.chatId, content: data.message });
    } catch (e) {
        console.error(e);
    }

    if (!message) return;

    const author = {
        id: user.id,
        name: user.name,
        email: user.email
    };

    const chat = await getChat({chatId: data.chatId});

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

