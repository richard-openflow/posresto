import Realm from "realm";


class BoxInformation extends Realm.Object {
    static schema = {
        name: 'BoxInformation',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId', indexed: true },
            dateOfZ: 'date?',
            pointOfSale: 'PointOfSale?',
            esp: {
                type: 'float?',
                default: 0
            },
            check: {
                type: 'float?',
                default: 0
            },
            CB: {
                type: 'float?',
                default: 0
            },
            bank: {
                type: 'float?',
                default: 0
            },
            room: {
                type: 'float?',
                default: 0
            },
            credit: {
                type: 'float?',
                default: 0
            },


        }
    }
}

export { BoxInformation }