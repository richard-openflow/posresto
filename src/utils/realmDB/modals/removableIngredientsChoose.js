import Realm from "realm";


class RemovableIngredientsChoose extends Realm.Object {
    static schema = {
        name: 'RemovableIngredientsChoose',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId', indexed: true },
            removableIngredient: { type: 'objectId', indexed: true },
            title: 'string?',
            required: { type: 'bool?', default: true },
            options: {
                type: "objectId[]"
            },

        }
    }
}

export { RemovableIngredientsChoose }
