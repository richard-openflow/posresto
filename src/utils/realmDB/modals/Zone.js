import Realm from "realm";

class Zone extends Realm.Object {
    static schema = {
        name: 'Zone',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId', indexed: true },
            enableOccasion: 'bool',
            pointOfSale: 'PointOfSale?',
            index: {
                type: 'int?',
                default: 1
            },
            name: 'string',
            nameSlug: 'string',
            percentage: 'int',
            timePerBooking: 'int',


        }
    }
}
export { Zone }
