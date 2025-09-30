import Realm from "realm";

class PayHistory extends Realm.Object {
    static schema = {
        name: 'PayHistory',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId', indexed: true },
            cancelled: { type: 'objectId?' },
            payType: 'string',
            email: 'string',
            phone: 'string',
            lastName: 'string',
            roomNumber: 'string',
            firstName: 'string',
            offertBy: 'string',
            amount: 'float?',

            products: {
                type: 'string[]'
            }
        }
    }
}
export { PayHistory }  