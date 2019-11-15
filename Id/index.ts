import cuid from 'cuid'

export interface IdService {
    makeId: () => string,
    isValidId: (id: string) => boolean
}

const Id: IdService = Object.freeze({
    makeId: cuid,
    isValidId: cuid.isCuid
});

export default Id;