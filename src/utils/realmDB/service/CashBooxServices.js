import Realm, { BSON } from 'realm';

import { realmConfig } from '../store';

const CashBoxServices = {}


CashBoxServices.create = async (data) => {

    try {
        let { dateOfZ, pointOfSale, esp, check, CB, bank, credit, room } = data
        let _id = new Realm.BSON.ObjectID()
        const realm = await Realm.open(realmConfig);
        return realm.write(() => {
            const apointOfSale = realm.objects('PointOfSale').filtered('_id == $0', new BSON.ObjectId(pointOfSale?._id))[0]


            return realm.create('BoxInformation', { _id, dateOfZ, pointOfSale: apointOfSale, esp: esp || 0, check: check || 0, CB: CB || 0, bank: bank || 0, credit: credit || 0, room: room || 0 }, 'modified');


        });
    } catch (error) {

        console.error({ error })
    }

}

export default CashBoxServices