import express from 'express';
import { postUser } from '../controllers/user';
import { makeGenericController } from '../controllers/make-generic-controller';
import { authenticateUser, getUserList, getUser } from '../use-cases/user';
import buildGetUserController from '../controllers/user/get-user.controller';
import { getChatsList } from '../use-cases/chat';


const router = express.Router();

const authenticationController = makeGenericController(authenticateUser);
const getUserListController = makeGenericController(getUserList);
const getUserController = buildGetUserController(getUser);
const getChatsListController = makeGenericController(getChatsList);

router.post('/', async function(req, res, next) {
    const response = await postUser(req);

    if (response.headers) {
      res.set(response.headers)
    }
    res.type('json');

    res.status(response.statusCode).send(response.body)

});

router.get('/', async function(req, res, next) {
    const response = await getUserListController(req);

    if (response.headers) {
        res.set(response.headers)
    }
    res.type('json');

    res.status(response.statusCode).send(response.body)

});

router.get('/:userId', async function(req, res, next) {
    const response = await getUserController(req);

    if (response.headers) {
        res.set(response.headers)
    }
    res.type('json');

    res.status(response.statusCode).send(response.body)

});

router.get('/chat-list/:userId', async function(req, res, next) {
    const response = await getChatsListController(req, {memberId: req.params.userId});

    if (response.headers) {
        res.set(response.headers)
    }
    res.type('json');

    res.status(response.statusCode).send(response.body)

});

router.post('/authenticate', async function(req, res, next){
    const response = await authenticationController(req);

    if (response.headers) {
        res.set(response.headers)
    }
    res.type('json');

    res.status(response.statusCode).send(response.body)
});

module.exports = router;
