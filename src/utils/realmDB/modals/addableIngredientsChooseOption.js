import Realm from "realm";


class AddableIngredientsChooseOption extends Realm.Object {
    static schema = {
        name: 'AddableIngredientsChooseOption',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId?', indexed: true },


            ingredient: {
                type: 'Ingredient'
            },
            price: {
                type: 'float?'
            },
            quantity: {
                type: 'int?'
            },

        }
    }
}

export { AddableIngredientsChooseOption }
