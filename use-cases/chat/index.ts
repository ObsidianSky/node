import { buildAddChat } from './add-chat';
import getDb from '../../db/get-db';
import { buildGetChatList } from './get-chat-list';
import Id from '../../Id';
import { buildGetChat } from './get-chat';

export const addChat = buildAddChat(getDb);
export const getChatsList = buildGetChatList(getDb, Id);
export const getChat = buildGetChat(getDb, Id);
