import Realm from 'realm';

import { realmConfig } from '../store';

const pointOfSaleController = {}


pointOfSaleController.create = async (data) => {

    try {

        let pointOfSales = data

        pointOfSales = pointOfSales?.map(d => {
            let temp = d
            temp.ice = d.company.ice
            temp._id = temp?._id
            if (temp?.logo) temp.logo._id = temp?.logo?._id
            return temp
        })


        const realm = await Realm.open(realmConfig);
        return realm.write(() => {
            return pointOfSales.map((a) => {
                return realm.create(
                    'PointOfSale',
                    a,
                    'modified',
                );
            })

        });
    } catch (error) {

        console.error({ error })
    }

}

export default pointOfSaleController