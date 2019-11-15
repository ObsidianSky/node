import { buildAddChat } from './add-chat';
import getDb from '../../db/get-db';
import { buildGetChatList } from './get-chat-list';
import Id from '../../Id';

const addChat = buildAddChat(getDb);
const getChatsList = buildGetChatList(getDb, Id);

export { addChat, getChatsList };