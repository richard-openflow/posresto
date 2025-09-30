import Realm from "realm";

class Unit extends Realm.Object {
    static schema = {
        name: 'Unit',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId', indexed: true },
            unitName: 'string',
            x: 'int',
            y: 'int',
            localX: { type: 'int?', default: 0 },
            localY: { type: 'int?', default: 0 },
            shape: 'string',
            Disponibility: 'bool',
            Category: 'string',
            isArchived: 'bool',
            unitType: 'string',
            unitNumber: 'int',
            seatsNumber: 'int',
            minSize: 'int',
            localization: 'string',
            Category: 'string',
            pointOfSale: 'PointOfSale?',

        }
    }
}
export { Unit }
