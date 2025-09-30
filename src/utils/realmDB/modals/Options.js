import { AccessibilityInfo } from "react-native";
import Realm from "realm";

class Options extends Realm.Object {
    static schema = {
        name: 'Option',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId', indexed: true },
            keyid: 'string?',
            type: 'string?', //conditions, addableIngredients, removableIngredients, addableProducts
            index: 'int?',
            title: 'string?',
            description: 'string?',
            isMultiple: 'bool?',
            required: 'bool?',
            conditionOptions: 'string[]',
            productOptions: 'ProductOptions[]',
            ingredientsOptions: 'Ingredient[]',


        }
    }
}
export { Options }  