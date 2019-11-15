export default function buildMakeMessage({sanitize, Id}) {
  return function makeMessage({
    id = Id.makeId(),
    type = 'text',
    content,
    createdOn = Date.now(),
    modifiedOn = Date.now(),
    authorId,
    chatId,
    deleted = false,
    edited = false,
    forwardedFrom = null
  } = {}) {
    if (!id || !Id.isValidId(id)) {
      throw new Error('Message must have a valid id.');
    }

    if (!content) {
      throw new Error('Message must have content.');
    }

    if (!authorId || !Id.isValidId(authorId)) {
      throw new Error('Message must have valid author id.');
    }

    // if (!chatId || !Id.isValidId(chatId)) {
    if (!chatId) {
      throw new Error('Message must have valid chat id.');
    }

    const sanitizedContent = sanitize(content);

    if (!sanitizedContent) {
      throw new Error('Message must have useful text.');
    }

    return Object.freeze({
      getId: () => id,
      getContent: () => content,
      getAuthorId: () => authorId,
      asPlainObject: () => Object.freeze({
        id, type, content, createdOn, modifiedOn, authorId, chatId, deleted, edited
      })
    });
  }
}