import { buildAddUser } from './add-user';
import getDb from '../../db/get-db';
import { buildAuthenticateUser } from './authenticate-user';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { buildGetUserList } from './get-user-list';
import { buildGetUser } from "./get-user";

const getSalt = () => {
    return crypto.randomBytes(16).toString('hex');
};

const scryptPassword = (password, salt) => {
    return crypto.scryptSync(password, salt, 64).toString('hex');
};

const signToken = (payload) => {
    return jwt.sign(payload, 'secret_or_private');
};

export const addUser = buildAddUser(getDb, getSalt, scryptPassword);
export const getUserList = buildGetUserList(getDb);
export const getUser = buildGetUser(getDb);
export const authenticateUser = buildAuthenticateUser(getDb, scryptPassword, signToken);

