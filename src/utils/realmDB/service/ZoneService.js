import Realm from 'realm';

import { realmConfig } from '../store';

const ZoneController = {};

ZoneController.create = async (data, pointOfSale) => {
  try {
    let zone = data;

    zone._id = zone?._id;
    const realm = await Realm.open(realmConfig);
    return realm.write(() => {
      zone.pointOfSale = realm
        .objects('PointOfSale')
        .filtered('_id == $0', pointOfSale)[0];
      return realm.create('Zone', zone, 'modified');
    });
  } catch (error) {
    console.error({ error });
  }
};

ZoneController.clear = async (pointOfSale) => {
  try {
    const realm = await Realm.open(realmConfig);
    return realm.write(() => {
      let zones = realm
        .objects('Zone')
        .filtered('pointOfSale._id == $0', pointOfSale);
      return realm.delete(zones);
    });
  } catch (error) {
    console.error({ error });
  }
};




ZoneController.deleteAll = async () => {
  try {
    const realm = await Realm.open(realmConfig);
    return realm.write(() => {
      let zones = realm?.objects('Zone');
      return realm.delete(zones);
    });
  } catch (error) {
    console.error({ error });
  }
};
export { ZoneController };
