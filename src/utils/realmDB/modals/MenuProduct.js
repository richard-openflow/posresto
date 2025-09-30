import Realm from "realm";

class MenuProduct extends Realm.Object {
    static schema = {
        name: 'MenuProduct',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId', indexed: true },
            product: {
                type: 'CategoryItems'
            }
        }
    }
}
export { MenuProduct }  