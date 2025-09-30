import Realm from "realm";

class CategoryItems extends Realm.Object {
    static schema = {
        name: 'CategoryItems',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId', indexed: true },
            itemName: 'string?',
            VATSales: 'int?',
            details: 'string?',
            productionTypes: 'ProductionTypes[]',
            desc: 'string?',
            price: 'int?',
            isFormula: { type: 'bool?', default: false },
            option: 'Option[]',
            image: {
                type: 'FileUpload?'
            }
        }
    }
}
export { CategoryItems }  