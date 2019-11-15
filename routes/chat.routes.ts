import express from 'express';
import { makeGenericController } from '../controllers/make-generic-controller';
import { addChat, getChatsList } from '../use-cases/chat';

const router = express.Router();

const postChatController = makeGenericController(addChat);
const getChatsListController = makeGenericController(getChatsList);

router.post('/', async function(req, res, next) {
    const response = await postChatController(req);

    if (response.headers) {
        res.set(response.headers)
    }
    res.type('json');

    res.status(response.statusCode).send(response.body)

});

router.get('/:memberId', async function(req, res, next) {
    const response = await getChatsListController(req, {memberId: req.params.memberId});

    if (response.headers) {
        res.set(response.headers)
    }
    res.type('json');

    res.status(response.statusCode).send(response.body)

});




module.exports = router;
