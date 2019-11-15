import express from 'express';
import { makeGenericController } from '../controllers/make-generic-controller';
import { addMessage, getMessages } from '../use-cases/message';



const router = express.Router();

const postMessageController = makeGenericController(addMessage);
const getMessageController = makeGenericController(getMessages);

router.get('/', async function(req, res, next){
    try {
        const response = await getMessageController(req);

        if (response.headers) {
            res.set(response.headers)
        }
        res.type('json');

        res.status(response.statusCode).send(response.body)
    } catch(e) {
        console.log(e)
    }

});


router.post('/', async function(req, res, next) {
    const response = await postMessageController(req);

    if (response.headers) {
        res.set(response.headers)
    }
    res.type('json');

    res.status(response.statusCode).send(response.body)

});



module.exports = router;
