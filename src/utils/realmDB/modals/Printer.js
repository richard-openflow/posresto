import Realm from "realm";

class Printer extends Realm.Object {
    static schema = {
        name: 'Printer',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId', indexed: true },
            main: { type: 'bool', default: false },
            name: 'string?',
            enbaled: { type: 'bool?', default: true },//enabled correct naming
            openCashbox: { type: 'bool?', default: false },
            autoCut: { type: 'bool?', default: true },
            printerNbrCharactersPerLine: { type: 'int?', default: 48 },
            type: {
                type: 'int',
                default: 1// 1 for wifi  0 for bluetooth
            },
            ipAdress: 'string',
            macAddress: 'string?',
            port: 'int',
            pointOfSale: 'PointOfSale?',
            productionTypes: 'ProductionTypes[]'
        }
    }
}
export { Printer }  