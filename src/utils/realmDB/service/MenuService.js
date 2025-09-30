import Realm from 'realm';

import { realmConfig } from '../store';

const menuController = {}


menuController.create = async (data, pointOfSale) => {

    try {
        const realm = await Realm.open(realmConfig);

        return realm.write(() => {
            const pos = realm.objects('PointOfSale').filtered('_id == $0', pointOfSale)[0]
            let menu = data

            menu._id = menu?._id
            menu.CategoryMenu = menu?.CategoryMenu?.map(d => {
                let temp = d

                temp._id = temp?._id

                temp?.products?.map((p) => {
                    let a = p

                    a.product.option = []

                    if (p.conditions?.length > 0) {
                        a.product.option = [...a.product.option, ...p.conditions.map(e => { return { ...e, type: 'conditions', _id: e?._id, conditionOptions: e?.options } })]
                    }

                    if (p.addableIngredients?.length > 0) {
                        a.product.option = [...a.product.option, ...p.addableIngredients.map(e => {
                            return {
                                ...e, type: 'addableIngredients', _id: e?._id, ingredientsOptions: e?.options.map((ea) => { return { ...ea.ingredient, addablePrice: ea.price, _id: ea.ingredient?._id } })
                            }
                        })]
                    }

                    if (p.removableIngredients?.length > 0) {
                        a.product.option = [...a.product.option, ...p.removableIngredients.map(e => {
                            return { ...e, type: 'removableIngredients', _id: e?._id, ingredientsOptions: e?.options.map((ea) => { return { ...ea, _id: ea?._id } }) }
                        })]
                    }

                    if (p.addableProducts?.length > 0) {

                        a.product.option = [...a.product.option, ...p.addableProducts.map(e => {

                            return {
                                ...e, type: 'addableProducts',
                                _id: e?._id,
                                productOptions: e?.options.map((ea) => {
                                    if (!ea.product) return false
                                    let product = realm.objects('CategoryItems').filtered('_id == $0', ea?.product?._id)[0]
                                    if (!product) {
                                        product = {
                                            ...ea?.product,
                                            _id: ea?.product?._id,
                                            productionTypes: []

                                        }
                                        if (product?.image) product.image._id = product?.image?._id
                                    }
                                    const po = {
                                        addablePrice: ea.price,
                                        _id: ea?._id,
                                        product

                                    }

                                    return po
                                }).filter((e) => e != false)
                            }
                        })]
                    }
                    a._id = a?._id
                    a.product._id = a?.product?._id
                    if (a?.product?.image) a.product.image._id = a?.product?.image?._id
                    return a
                })

                return temp
            })


            menu.CategoryMenu = menu?.CategoryMenu.map((d) => {
                let temp = d
                temp?.products?.map((p) => {

                    let a = p
                    a.product.productionTypes = a?.product?.productionTypes?.map((e) => {
                        let pt = e
                        pt._id = new Realm.BSON.ObjectId(pt?._id)
                        pt.pointOfSale = pos
                        return pt
                    })

                })
                return temp
            })
            menu.pointOfSale = pos
            const a = realm.create('Menu', menu, 'modified');

            return a
        });
    } catch (error) {

        console.error({ error })
    }

}


menuController.delete = async (data) => {
    try {
        const realm = await Realm.open(realmConfig);
        return realm.write(() => {
            const menus = realm.objects('Menu')
            for (const m of menus) {

                if (data.findIndex(e => e._id + '' == m._id + '') < 0) {
                    realm.delete(m)

                }
            }
        });
    } catch (error) {
        console.error({ error })
    }
}

menuController.deletaAllTheOptions = async () => {
    try {
        const realm = await Realm.open(realmConfig);
        return realm.write(() => {
            const Option = realm.objects('Option')
            const Ingredient = realm.objects('Ingredient')
            // const addableIngredients = realm.objects('AddableIngredientsChoose')
            // const removableIngredients = realm.objects('RemovableIngredientsChoose')
            // const addableProducts = realm.objects('addableProducts')
            realm.delete(Ingredient)
            realm.delete(Option)


        });
    } catch (error) {
        console.error({})
    }
}


menuController.deleteAll = async (data) => {
    try {
        const realm = await Realm.open(realmConfig);
        return realm.write(() => {
            const menus = realm.objects('Menu')
            realm.delete(menus)
        });
    } catch (error) {
        console.error({ error })
    }
}

export {
    menuController
};
