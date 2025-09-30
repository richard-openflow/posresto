import { AccessibilityInfo } from "react-native";
import Realm from "realm";

class User extends Realm.Object {
    static schema = {
        name: 'User',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId', indexed: true },
            firstName: 'string?',
            lastName: 'string?',
            email: 'string?',
            phone: 'string?',
            pointOfSale: 'PointOfSale?',
            pin: 'string?',
            role: 'string?',
            accessibleMenu: 'objectId[]',
            accessibleZone: 'string[]',
            avatar: 'FileUpload?',
            active: {
                type: 'bool?',
                default: false
            },
            connectedUser: {
                type: 'bool?',
                default: false
            }

        }
    }
}
export { User }  