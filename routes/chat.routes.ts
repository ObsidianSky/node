import express from 'express';
import { makeGenericController } from '../controllers/make-generic-controller';
import { addChat, getChat, getChatsList } from '../use-cases/chat';

const router = express.Router();

const postChatController = makeGenericController(addChat);
const getChatController = makeGenericController(getChat);

router.post('/', async function(req, res, next) {
    const response = await postChatController(req);

    if (response.headers) {
        res.set(response.headers)
    }
    res.type('json');

    res.status(response.statusCode).send(response.body)

});

router.get('/:chatId', async function(req, res, next) {
    const response = await getChatController(req, {chatId: req.params.memberId});

    if (response.headers) {
        res.set(response.headers)
    }

    res.type('json');

    res.status(response.statusCode).send(response.body)

});



getChat



module.exports = router;
