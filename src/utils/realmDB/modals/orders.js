import Realm from "realm";


class Orders extends Realm.Object {
    static schema = {
        name: 'Orders',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId', indexed: true },
            orderNumber: "string",
            numberPeople: {
                type: "int?",
                default: 1
            },
            Z: {
                type: 'BoxInformation?',
                default: null,
            },
            origin: {
                type: 'string?',
                default: 'pos',
            },
            uniqueId: {
                type: 'string?',
                default: '-',
            },
            createdBy: {
                type: 'mixed?',
                default: null,
            },
            type: 'string',
            note: 'string?',
            nextInKitchen: {
                type: 'int?',
                default: 0
            },
            createdAt: 'int?',
            paid: { type: 'bool?', default: false },
            unit: 'Unit?',
            user: 'User?',
            zone: 'Zone?',
            paidHistory: { type: 'PayHistory[]', default: [] },
            archived: { type: 'bool?', default: false },
            pointOfSale: 'PointOfSale?',
            firstName: {
                type: 'string?'
            },
            lastName: {
                type: 'string?'
            },
            email: {
                type: 'string?'
            },
            phone: {
                type: 'string?'
            },
            addresse: {
                type: 'string?'
            },
            Ice: {
                type: 'string?'
            },
            Company: {
                type: 'string?'
            },
            commandProduct: {
                type: 'CommandProduct[]'
            },
            sync: {
                type: 'bool?',
                default: false
            },
            saved: {
                type: 'bool?',
                default: false
            },
            startSent: {
                type: 'bool?',
                default: false
            },
            wasConnectedOnCreation: {
                type: 'bool?',
                default: true
            },
            bookingId: {
                type: 'string?',
                default: null
            },
            paymentRequired: {
                type: 'bool?',
                default: false
            },
            payStatus: {
                type: 'string?',
                default: null
            },
            payAmount: {
                type: 'int?',
                default: 0
            }
        }
    }
}

export { Orders }