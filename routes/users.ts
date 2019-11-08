import express from 'express';
import { postUser } from '../controllers/user';
import { makeGenericController } from '../controllers/make-generic-controller';
import { authenticateUser } from '../use-cases';


const router = express.Router();

const authenticationController = makeGenericController(authenticateUser);

router.post('/', async function(req, res, next) {
    const response = await postUser(req);

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
