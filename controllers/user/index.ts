import buildPostUser from './post-user.controller';
import { addUser } from '../../use-cases/user';

const postUser = buildPostUser({ addUser });

export {postUser}