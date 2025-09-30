import Realm from "realm";


class AddableIngredientsChoose extends Realm.Object {
    static schema = {
        name: 'AddableIngredientsChoose',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId?', indexed: true },
            addableIngredient: { type: 'objectId', indexed: true },
            title: 'string?',

            options: {
                type: "AddableIngredientsChooseOption[]"
            },

        }
    }
}

export { AddableIngredientsChoose }
// ingredient
// price
// quantity