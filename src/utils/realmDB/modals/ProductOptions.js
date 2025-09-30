import Realm from "realm";

class ProductOptions extends Realm.Object {
    static schema = {
        name: 'ProductOptions',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId', indexed: true },
            product: 'CategoryItems?',
            addablePrice: {
                type: 'float?',
                default: 0
            },



        }
    }
}
export { ProductOptions }

