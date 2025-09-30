import Realm from "realm";

class Ingredient extends Realm.Object {
    static schema = {
        name: 'Ingredient',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId', indexed: true },
            ref: 'string?',
            ingredientName: 'string?',
            description: 'string?',
            ingredientType: 'string?',
            sellUnit: 'string?',
            sellPrice: 'float?',
            buyingPrice: 'float?',
            addablePrice: {
                type: 'float?',
                default: 0
            },



        }
    }
}
export { Ingredient }

