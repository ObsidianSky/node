export default function buildMakeUser(Id) {
  return function makeUser({
    id = Id.makeId(),
    name,
    email,
    bio = '',
    friends = [],
    chats = [],
    lastActivity = null
   } = {}) {
    if (!id) {
      throw new Error('User must have a valid id.');
    }

    if (!name) {
      throw new Error('User must have a name.');
    }
    if (!email) {
      throw new Error('User must have a email.');
    }

    return Object.freeze({
        getId: () => id,
        getName: () => name,
        getEmail: () => email,
        getBio: () => bio,
        getFriendsIds: () => [...friends],
        getChatsIds: () => [...chats],
        getLastActivity: () => lastActivity
      }
    )
  }
}