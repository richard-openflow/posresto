

import Realm from 'realm';

import { realmConfig } from '../store';

const UnitController = {}


UnitController.create = async (data, pointOfSale) => {

    try {
        let unit = data

        unit._id = unit?._id
        const realm = await Realm.open(realmConfig);
        return realm.write(() => {
            unit.pointOfSale = realm.objects('PointOfSale').filtered('_id == $0', pointOfSale)[0]
            return realm.create('Unit', unit,
                'modified',
            );
        });
    } catch (error) {

        console.error({ error })
    }

}


UnitController.updatePosition = async (data, pointOfSale) => {

    try {
        let unit = data

        unit._id = unit?._id
        const realm = await Realm.open(realmConfig);
        return realm.write(() => {
            unit.pointOfSale = realm.objects('PointOfSale').filtered('_id == $0', pointOfSale)[0]
            return realm.create('Unit', unit,
                'modified',
            );
        });
    } catch (error) {

        console.error({ error })
    }

}



UnitController.clear = async (pointOfSale) => {
    try {
        const realm = await Realm.open(realmConfig);
        return realm.write(() => {
            let tables = realm
                .objects('Unit')
                .filtered('pointOfSale._id == $0', pointOfSale);
            return realm.delete(tables);
        });
    } catch (error) {
        console.error({ error });
    }
};
UnitController.deleteAll = async () => {
    try {
        const realm = await Realm.open(realmConfig);
        return realm.write(() => {
            let tables = realm
                .objects('Unit')

            return realm.delete(tables);
        });
    } catch (error) {
        console.error({ error });
    }
};


export {
    UnitController
};
