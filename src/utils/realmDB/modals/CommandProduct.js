import Realm from "realm";


class CommandProduct extends Realm.Object {
    static schema = {
        name: 'CommandProduct',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId', indexed: true },
            addOnDate: 'date?',
            clickCount: 'int',
            dateZ: {
                type: 'date?',
            },
            sent: { type: 'int', default: 0 },
            orderClassifying: {
                type: 'float?',
                default: 1
            },
            paid: { type: 'bool?', default: false },
            status: {
                type: "string?",
                default: 'new',
            },
            linkToFormula: {
                type: "objectId?",
                default: null
            },
            unid: {
                type: "string?",
                default: null
            },

            addablePrice: {
                type: "int?",
                default: null
            },
            product: {
                type: "CategoryItems"
            },
            conditionsChoose: 'ConditionsChoose[]',
            addableIngredientsChoose: 'AddableIngredientsChoose[]',
            removableIngredientsChoose: 'RemovableIngredientsChoose[]',
            note: 'string?',
        }
    }
}

export { CommandProduct }