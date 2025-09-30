import Realm from "realm";


class ConditionsChoose extends Realm.Object {
    static schema = {
        name: 'ConditionsChoose',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId?', indexed: true },
            condition: { type: 'objectId', indexed: true },
            title: 'string?',
            required: { type: 'bool?', default: true },
            options: {
                type: "string[]"
            },

        }
    }
}

export { ConditionsChoose }
