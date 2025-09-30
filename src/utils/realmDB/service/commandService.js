

import { generateId } from "../../../utils/sqliteDB"
import { realmConfig } from '../store';
import moment from 'moment';
import { sendToEveryOne } from '../../Udp/services';
import { getSocket } from '../../socket';
import DeviceInfo from 'react-native-device-info';
import CashBoxServices from './CashBooxServices';
import { API } from '../../BaseApi';
import Snackbar from 'react-native-snackbar';
import tinyEmitter from 'tiny-emitter/instance'
import { checkIfOrderPayed } from '../../helpers';

const CommandController = {}

function changeAllIds(obj) {
    if (Array.isArray(obj)) {
        return obj.map(item => changeAllIds(item));
    } else if (typeof obj === 'object' && obj !== null) {
        let updated = { ...obj };
        for (const key in obj) {
            if (key === '_id' || key == "cancelled") {
                updated[key] = obj[key]
            } else if (key == "condition" || key == 'removableIngredient' || key == "addableIngredient" || key == "linkToFormula") {
                if (obj[key]) {
                    if (key != 'linkToFormula')
                        updated['_id'] = obj[key]
                    updated[key] = obj[key]
                }
            } else if (key == "options" && updated[key].every(a => typeof(a))) {
                updated[key] = updated[key].map((a) => a)
            } else if (Array.isArray(updated[key]) || (typeof updated[key] === 'object' && updated[key] !== null)) {
                updated[key] = changeAllIds(updated[key])
            }
        }
        return updated;
    }
    return obj;
}

CommandController.create = async (orders) => {

    try {
        const realm = await Realm.open(realmConfig);
        const o = realm.write(() => {
            for (const data of orders) {


                let order = JSON.parse(JSON.stringify(data))

                if (!order?._id) order._id = generateId()
                else order._id = order?._id

                if (!order?.orderNumber) order.orderNumber = moment().valueOf() + ''
                else order.orderNumber = order.orderNumber + ''

                if (!order?.createdAt) order.createdAt = moment().valueOf()

                order = changeAllIds(order)

                const pos = realm.objects('PointOfSale').filtered('_id == $0', new BSON.ObjectId(data?.pointOfSale?._id))[0]

                const user = realm.objects('User').filtered('_id = $0', data?.user?._id)[0]

                order.pointOfSale = pos
                order.user = user

                if (!order.saved) {
                    console.log("an order is saved")
                    order.saved = true
                    tinyEmitter.emit('saved-order', order._id)
                    return realm.create('Orders', order, 'modified',);
                }

                // if (!order.sync) {
                //     console.log("order.sync", order.sync)
                //     order.sync = checkIfOrderPayed(order) || false
                //     if (order.sync)
                //         tinyEmitter.emit('sync-order', order._id)
                //     return realm.create('Orders', order, 'modified',);

                // }
            }
        });

        return o
    } catch (error) {
        console.error('==> ', { error })
    }

}

CommandController.updateCommandStatus = async (ids, useTCP = true, currentRestaurant) => {
    const idsQuery = ids.map(id => `oid(${id})`).join(', ')

    const realm = await Realm.open(realmConfig);
    const o = realm.write(() => {
        const cc = realm.objects('CommandProduct')
            .filtered(`_id IN { ${idsQuery} }`)
        cc.map((c) => {
            let status = 'done'
            if (c.status == 'new') {
                status = "inprogress"
            } else if (c.status == 'inprogress') {
                status = "awaiting"
            } else if (c.status == 'awaiting')
                status = "done"
            else if (c.status == 'cancel')
                status = "cancel"
            c.status = status
        })

        if (useTCP)
            sendToEveryOne({ event: 'UPDATE_COMMAND_STATUS', payload: ids })
        return cc
    });
    if (currentRestaurant) {
        const DeviceId = await DeviceInfo.getDeviceId()
        getSocket().emit(`update-status-kitchen`, { _id: currentRestaurant, data: { ids, DeviceId } })
    }
    return o
}

CommandController.updateCommandKitchen = async (id, type = 'sent', value, currentRestaurant, useTCP = true) => {

    const _id = id
    const realm = await Realm.open(realmConfig);
    const o = realm.write(() => {
        const cc = realm.objects('CommandProduct').filtered('_id == $0', _id)[0];
        if (type == 'sent')
            cc.sent = value
        if (type == 'orderClassifying')
            cc.orderClassifying = value
        return cc
    });
    if (currentRestaurant) {
        const DeviceId = await DeviceInfo.getDeviceId()
        getSocket().emit(`update-command-kitchen`, { _id: currentRestaurant, data: { id, type, value, DeviceId } })
    }
    return o
}

CommandController.cancelCommnadItem = async (id, useTCP = true) => {
    const _id = id
    const realm = await Realm.open(realmConfig);
    const o = realm.write(() => {
        const cc = realm.objects('CommandProduct').filtered('_id == $0', _id)[0];
        cc.status = 'cancel'
        return cc
    });
    if (useTCP)
        sendToEveryOne({ event: 'CANCEL_COMMAND_CONTROLLER', payload: id })
    return o
}

CommandController.payCommand = async (id, payType, amount, useTCP = true, roomNumber, firstName, lastName, phone, email, products, currentRestaurant, offertBy = "") => {
    const _id = id
    const realm = await Realm.open(realmConfig);
    const o = realm.write(() => {
        let cc = realm.objects('Orders').filtered('_id == $0', _id)[0];
        let pay = realm.create('PayHistory', {
            _id: generateId(),
            payType,
            amount,
            roomNumber,
            firstName,
            lastName,
            phone,
            email,
            products,
            offertBy
        }, 'modified',);

        if (cc?.paidHistory?.length > 0)
            cc.paidHistory = [...cc?.paidHistory, pay]
        else
            cc.paidHistory = [pay]



        cc.paid = false

        API.post("/orders/pos-create-order", JSON.parse(JSON.stringify({ ord: cc, Z: cc?.Z?._id }))).then((data) => {

        }).catch(e => {

            Snackbar.show({
                text: 'Verify your internet',
                duration: Snackbar.LENGTH_SHORT,
            })
        });

        return cc
    });
    if (currentRestaurant) {
        const DeviceId = await DeviceInfo.getDeviceId()
        getSocket().emit('pay-command', { _id: currentRestaurant, data: { id, payType, amount, useTCP, roomNumber, firstName, lastName, phone, email, products, DeviceId } })
    }
    return o
}

CommandController.noteACommand = async (orderNumber, note, useTCP = true) => {

    const realm = await Realm.open(realmConfig);
    const o = realm.write(() => {
        let cc = realm.objects('Orders').filtered('orderNumber == $0', orderNumber + '')[0];

        cc.note = note
        return cc
    });
    if (useTCP)
        sendToEveryOne({ event: 'NOTE_A_COMMAND_CONTROLLER', payload: { orderNumber, note } })
    return o
}

CommandController.sentAllCommandToKitchen = async (id, useTCP = true, callback = () => { }) => {

    const _id = id
    const realm = await Realm.open(realmConfig);
    const o = realm.write(() => {
        let cc = realm.objects('Orders').filtered('_id == $0', _id)[0];

        cc.commandProduct.map((a) => {
            a.sent = a?.orderClassifying <= a.sent ? a.sent : a.sent + 1
        })

        cc.startSent = true;
        cc.nextInKitchen += 1

        return cc
    });
    callback(o)
    if (useTCP)
        sendToEveryOne({ event: 'SENT_ALL_COMMAND_KITCHEN_CONTROLLER', payload: id })

    return o
}

CommandController.findByUnitNumber = async (orders, unitNumber) => {
    try {
        let fOrders = []
        const realm = await Realm.open(realmConfig);
        let unit = {}
        const o = realm.write(() => {
            let cc = orders.filter((e) => e?.unit?.unitNumber == parseInt(unitNumber));
            unit = realm.objects('Unit').filtered('unitNumber == $0', parseInt(unitNumber))[0];
            for (const c of cc) {
                const total = c?.commandProduct?.reduce((total, { product, clickCount, status }) => {
                    if (status == 'cancel')
                        return total
                    return total + product.price * clickCount;
                }, 0)

                const totalPayed = c?.paidHistory?.reduce((total, { amount }) => {
                    return total + amount;
                }, 0)
                if (total > totalPayed) {
                    fOrders.push(c)
                }

            }
            return fOrders



        });
        return {
            order: o,
            unit
        }
    } catch (error) {

    }
}

CommandController.findUnsentCommand = async () => {
    try {

        const realm = await Realm.open(realmConfig);
        let dd = moment(new Date(moment().format('YYYY-MM-DD 00:00:00')))
        let df = dd.add(1, 'day')
        dd = dd.valueOf()
        df = df.valueOf()

        return realm.write(() => {
            const a = realm.objects('Orders').filtered('createdAt >= $0 && createdAt <= $1', dd, df);

            return a

        });

    } catch (error) {

    }
}

CommandController.hasBeenSynced = async (id,) => {
    const _id = id
    const realm = await Realm.open(realmConfig);
    const o = realm.write(() => {
        let cc = realm.objects('Orders').filtered('_id == $0', _id)[0];
        cc.sync = true
        return cc
    });
    return o
}

CommandController.getUnPaidCommmand = async ({ orders, dt, unitId }) => {

    try {


        let order = orders.filter((e) => {


            const total = e?.commandProduct?.reduce((total, { product, linkToFormula, addablePrice, clickCount, status, addableProductsChoose, addableIngredientsChoose }) => {
                let subtotal = addableIngredientsChoose?.reduce((t, a) => {
                    let aaa = a?.options.reduce((i, j) => i + j?.price * j?.quantity, 0)
                    return t + aaa
                }, 0) || 0

                let subtotalproduct = addableProductsChoose?.reduce((t, a) => {
                    let aaa = a?.options?.reduce((i, j) => i + j?.price * j?.quantity, 0)
                    return t + aaa
                }, 0) || 0

                if (status == 'cancel')
                    return total

                return total + ((linkToFormula ? addablePrice : product?.price) * clickCount) + subtotal + subtotalproduct;
            }, 0)

            const totalPayed = e?.paidHistory?.reduce((total, { amount }) => {
                return total + amount;
            }, 0)


            if (totalPayed >= total && total > 0) {

                return false
            }
            return e.type == "onsite"
        });

        if (unitId) {
            order = order?.filter((e) => e?.unit?._id + '' == unitId + '')
        }
        return order

    } catch (error) {

    }
}

CommandController.changeUnitOfCommand = async (orders = [], id, new_unit, callback = () => { }) => {
    try {
        const _id = id
        const u_id = new_unit?._id
        const realm = await Realm.open(realmConfig);
        const o = realm.write(() => {

            let ord = orders.find((e) => e?._id + '' == _id + '') || {};

            let unit = realm.objects('Unit').filtered('_id == $0', u_id)[0];


            ord.unit = unit
            callback(ord)
            return ord
        });
        return o
    } catch (error) {

    }

}

CommandController.setDateZToCommand = async ({ orders = [], pointOfSale, esp, check, CB, bank, credit, room, amountCash, amountCreditCard, amountBank, amountCheck, amountRoom, amountCredit, amountOffer, uniqueId, dbdid, nbrPeople }, callback = () => { }, callError = () => { }) => {
    try {
        const realm = await Realm.open(realmConfig);
        const newDate = new Date()
        const cashBox = await CashBoxServices.create({ dateOfZ: newDate, pointOfSale, esp, check, CB, bank, credit, room, })
        const { z } = await API.post("/orders/pos-create-z", { ...cashBox.toJSON(), amountCash, amountCreditCard, amountBank, amountCheck, amountRoom, amountCredit, amountOffer, uniqueId, dbdid, nbrPeople })

        try {
            const o = orders.filter((e) => e?.origin == 'pos')
            for (let ord of o) {
                if (!ord?.Z)
                    ord.Z = JSON.parse(JSON.stringify(z))
                API.post("/orders/pos-create-order", JSON.parse(JSON.stringify({ ord: { ...ord, pointOfSale: ord?.pointOfSale }, Z: ord?.Z?._id })))
            }

        } catch (err) {
            alert('Erreur while uploading data to server')
            callError()

        } finally {
            tinyEmitter.emit('clear-order-number')
            realm.write(async () => {
                realm.delete(realm.objects('Orders').filtered('pointOfSale._id == $0', pointOfSale?._id))
            })

            callback()
        }

    } catch (error) {

        callError()
    }
}

CommandController.transferCommand = async ({ pointOfSale, sender, receiver }) => {
    try {
        const realm = await Realm.open(realmConfig);
        realm.write(async () => {
            const orderSender = realm.objects('Orders').filtered('Z == null && user._id == $0 && pointOfSale._id == $1', sender, pointOfSale)
            const receiverUser = realm.objects('User').filtered('_id == $0', receiver)[0]


            if (receiverUser)
                for (const cmd of orderSender) {
                    cmd.user = receiverUser
                }
        })
    } catch (error) {

    }
}

CommandController.deleteOrders = async (ord, pointOfSale) => {
    try {
        const realm = await Realm.open(realmConfig);
        realm.write(async () => {
            const orderSender = realm.objects('Orders').filtered('pointOfSale._id == $0', pointOfSale)

            let db = orderSender

            const difference = db?.reduce((a, o) => {
                if (!ord?.some(e => o?._id + '' == e?._id + '')) {
                    a.push(o?._id);
                }
                return a;
            }, []);

            difference.map((e) => {
                const a = realm.objects('Orders').filtered(' _id == $0', e)
                realm.delete(a)
            })
        })


    } catch (error) {
        console.log(error, ord)
    }
}

export { CommandController };