import Realm from "realm";


class FileUpload extends Realm.Object {
    static schema = {
        name: 'FileUpload',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId', indexed: true },
            fieldName: 'string?',
            originalName: 'string?',
            encoding: 'string?',
            mimeType: 'string?',
            destination: 'string?',
            fileName: 'string?',
            path: 'string?',
            size: 'int?',

        }
    }
}

export { FileUpload }