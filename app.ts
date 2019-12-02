import { socketServer } from './socket/socket';

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

socketServer.listen(3002, () => console.log('Listening socket.io on port 3002'));

