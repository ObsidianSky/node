import buildPostUser from './post-user.controller';
import { addUser } from '../../use-cases';

const postUser = buildPostUser({ addUser });

export {postUser}