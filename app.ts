import { addMessage } from './use-cases/message';
import message from './entities/message/message';
import { getChat } from './use-cases/chat';
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
        console.log(data);
        await handleChatMessage(data.payload, user);
    })
});

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