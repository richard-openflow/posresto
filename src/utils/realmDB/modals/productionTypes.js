import Realm from "realm";

class ProductionTypes extends Realm.Object {
    static schema = {
        name: 'ProductionTypes',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId', indexed: true },
            pointOfSale: 'PointOfSale?',
            name: 'string?',
        }
    }
}
export { ProductionTypes }  