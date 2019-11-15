import { IdService } from '../../Id';

interface makeChatDependencies {
    Id: IdService
}

export function buildMakeChat({Id}: makeChatDependencies) {
    return function makeChat({
                                 id = Id.makeId(),
                                 name = 'NoNameChat',
                                 members = []
                             } = {}) {
        const clonedMembers = [...members];

        if (!id || !Id.isValidId(id)) {
            throw new Error('Chat must have a valid id.');
        }

        if (clonedMembers.length && clonedMembers.some(memberId => !Id.isValidId(memberId))) {
            throw new Error('Some chat member id is not valid.');
        }

        return Object.freeze({
            getId: () => id,
            getName: () => name,
            asPlainObject: () => Object.freeze({
                id,
                name,
                members: Object.freeze(clonedMembers)
            })
        })
    }
}