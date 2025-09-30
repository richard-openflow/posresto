

import Realm from 'realm';

import { realmConfig } from '../store';

const UserController = {}

UserController.create = async (data, pointOfSaleId) => {
    try {
        let u = data

        let user = {}
        user._id = new Realm.BSON.ObjectId(u?._id)
        user.firstName = u?.firstName
        user.lastName = u?.lastName
        user.email = u?.email
        user.role = u?.role
        user.phone = u?.phone
        user.pointOfSale = pointOfSaleId
        user.connectedUser = u?.connectedUser || false
        user.avatar = { ...(u?.avatar || []), _id: new Realm.BSON.ObjectId(u?.avatar?._id) }

        user.pin = u?.pin
        user.accessibleMenu = u?.accessibleMenu?.map((e) => new Realm.BSON.ObjectId(e?._id))
        user.accessibleZone = u?.accessibleZone?.map((e) => e)

        const realm = await Realm.open(realmConfig);
        return realm.write(() => {
            user.pointOfSale = realm.objects('PointOfSale').filtered('_id == $0', new Realm.BSON.ObjectId(pointOfSaleId))[0]

            const o = realm.create('User', user, 'modified');

            return o
        });

    } catch (error) {

        console.error(error)
    }

}

UserController.setActiveUser = async (id) => {
    try {
        const realm = await Realm.open(realmConfig);
        return realm.write(() => {
            const staff = realm.objects('User')
            for (const user of staff) {

                if (id + '' != '' + user._id)
                    user.active = false
                else
                    user.active = true
            }

        });
    } catch (error) {

    }
}

export { UserController };




