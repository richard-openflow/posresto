import Realm from "realm";


class CategoryMenu extends Realm.Object {
    static schema = {
        name: 'CategoryMenu',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId', indexed: true },
            name: 'string',
            color: {
                type: 'string',
                default: 'red'
            },
            products: {
                type: "MenuProduct[]"
            },
        }
    }
}

export { CategoryMenu }