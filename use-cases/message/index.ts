import { buildAddMessage } from './add-message';
import getDb from '../../db/get-db';
import { buildGetMessageList } from './get-message-list';
import { buildEditMessage } from './edit-message';
import Id from '../../Id';

const sanitize = text => text.trim();

const addMessage = buildAddMessage(getDb);
const getMessages = buildGetMessageList(getDb);
const editMessage = buildEditMessage(getDb, Id, sanitize);

export { addMessage, getMessages, editMessage };