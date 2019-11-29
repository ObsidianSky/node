import { addMessage } from './use-cases/message';
import message from './entities/message/message';
import { getChat, getChatsList } from './use-cases/chat';
import { getUser } from './use-cases/user';

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const indexRouter = require('./routes');
const userRouter = require('./routes/user.routes');
const messageRouter = require('./routes/message.routes');
const chatRouter = require('./routes/chat.routes');

const app = express();

const server = require('http').createServer();
const io = require('socket.io')(server);

const corsOptions = {
    origin: 'http://localhost:3000'
};
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/message', messageRouter);
app.use('/chat', chatRouter);

app.listen(3001, function () {
    console.log('Listening REST on port 3001!');
});

server.listen(3002, () => console.log('Listening socket.io on port 3002'));

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