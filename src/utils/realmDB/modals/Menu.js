import Realm from "realm";


class Menu extends Realm.Object {
    static schema = {
        name: 'Menu',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId', indexed: true },
            menuName: 'string',
            pointOfSale: 'PointOfSale?',
            CategoryMenu: {
                type: "CategoryMenu[]"
            },

        }
    }
}

export { Menu }
