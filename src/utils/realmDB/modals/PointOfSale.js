import Realm from "realm";

class PointOfSale extends Realm.Object {
    static schema = {
        name: 'PointOfSale',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId', indexed: true },
            title: 'string',
            address: 'string',
            phone: 'string',
            email: 'string',
            category: 'string',
            ice: 'string?',
            logo: {
                type: 'FileUpload?'

            }
        }
    }
}
export { PointOfSale }  