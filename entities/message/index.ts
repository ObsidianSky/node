import buildMakeMessage from "./message";
import Id from '../../Id';

const sanitize = text => text.trim();

const makeMessage = buildMakeMessage({sanitize, Id});

export default makeMessage;