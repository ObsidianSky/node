import { buildAddMessage } from './add-message';
import getDb from '../../db/get-db';
import { buildGetMessageList } from './get-message-list';


const addMessage = buildAddMessage(getDb);
const getMessages = buildGetMessageList(getDb);

export { addMessage, getMessages };