import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import React, { useEffect } from 'react';
import { View } from 'react-native';
import BackgroundService from 'react-native-background-actions';
import DeviceInfo from 'react-native-device-info';
import { NetworkInfo } from 'react-native-network-info';
import TinyEmiter from 'tiny-emitter/instance';
import { store } from '../../redux';
import { bookingOrderCreation, createOrder, getAllBookingOfDay, sendAllToKitchen } from '../../redux/actions/orderActions';
import { createClient, createTCPServer } from '../TCP/services';
import { getUdpSocket, SendMessage, SendMessageToIpAdresse } from '../Udp/services';
import { ENDOFFILE } from '../config';
import { CommandController } from '../realmDB/service/commandService';
import { realmConfig, useSQLQuery } from '../realmDB/store';
import { getSocket } from '../socket';
import { createAnswer, createPeer, sendDATA, setAnswer } from '../webRTC/service';

import ThermalPrinterModule from 'react-native-thermal-printer';
import { getPayloadProduction } from '../helpers';

let devices = {}
let intId = {}
let unsubscribe = console.log
const VeryIntensiveTask = async ({ pp }) => {
    try {
        const id = await DeviceInfo.getDeviceId()
        await new Promise(async (resolve) => {
            const IP = await NetworkInfo.getIPV4Address()
            let devices = {};

            getUdpSocket(true).on('message', async function (msg, rinfo) {

                try {
                    const data = JSON.parse(msg.toString())

                    const master = await AsyncStorage.getItem('MasterDevices')
                    const uid = await AsyncStorage.getItem('uiid')

                    if (data?.event === 'CONNECT_TO_ME' && IP != rinfo?.address && master == 'true' && data?.uid == uid) {

                        createPeer({ devices, rinfo, data })

                    } else if (data?.event == 'CONNECTION_OFFER') {
                        createAnswer({ devices, rinfo, data })
                    } else if (data?.event == 'CONNECTION_AMSWER') {
                        setAnswer({ devices, rinfo, data })
                    } else if (data?.event == 'GET_ALL_NEARBY_DEVICES') {
                        SendMessageToIpAdresse({ event: 'IP_CLIENT_DISCOVER', payload: IP }, rinfo.address)
                        // if (rinfo.address != IP) {
                        //     let nearyBy = JSON.parse(await AsyncStorage.getItem('nearbyclients') || JSON.stringify([]))

                        //     nearyBy = [...new Set([...nearyBy, payload])].filter(e => e);
                        //     await AsyncStorage.setItem('nearbyclients', JSON.stringify(nearyBy))
                        //     // alert('A Devices Has been Add')
                        // }
                        // } else if (event == 'IP_CLIENT_DISCOVER') {
                        //     if (payload != IP) {
                        //         let nearyBy = JSON.parse(await AsyncStorage.getItem('nearbyclients') || JSON.stringify([]))

                        //         nearyBy = [...new Set([...nearyBy, payload])].filter(e => e);
                        //         await AsyncStorage.setItem('nearbyclients', JSON.stringify(nearyBy))
                        //         //  alert('Done')
                        //     }
                    }
                } catch (error) {
                    console.error('getUdpSocket().on(message', error)
                }

            })
            createTCPServer((data) => {
                try {
                    store.dispatch({ type: "TCP_DATA_SENDING_LOADING" })

                    const { event, payload } = data
                    if (event == 'COMMAND_CONTROLLER_CREATE') {
                        const { data } = payload
                        CommandController.create([data], new Realm.BSON.ObjectId(data.pointOfSale._id), false)
                    } else if (event == 'UPDATE_COMMAND_STATUS') {
                        CommandController.updateCommandStatus(payload.map(e => new Realm.BSON.ObjectId(e)), false)
                    }
                    else if (event == 'UPDATE_COMMAND_KITCHEN') {
                        CommandController.updateCommandKitchen(new Realm.BSON.ObjectId(payload), false)
                    }
                    else if (event == 'CANCEL_COMMAND_CONTROLLER') {
                        CommandController.cancelCommnadItem(new Realm.BSON.ObjectId(payload), false)
                    }
                    else if (event == 'PAY_COMMAND_CONTROLLER') {
                        const { id, payType, amount } = payload
                        CommandController.payCommand(id, payType, amount, false)
                    }
                    else if (event == 'NOTE_A_COMMAND_CONTROLLER') {
                        const { orderNumber, note } = payload
                        CommandController.noteACommand(orderNumber, note, false)
                    }
                    else if (event == 'SENT_ALL_COMMAND_KITCHEN_CONTROLLER') {
                        CommandController.sentAllCommandToKitchen(new Realm.BSON.ObjectId(payload), false)
                    } else if (event == 'SYNC_DATA') {
                        const { ord, IP } = payload
                        CommandController.create([ord], new Realm.BSON.ObjectId(ord?.pointOfSale?._id), false)
                        createClient(IP, (Buffer.from(JSON.stringify({ event: 'SYNC_DATA_RECEIVED', payload: ord?._id })).toString('base64') + ENDOFFILE))
                    } else if (event == 'SYNC_DATA_RECEIVED') {
                        // CommandController.hasBeenSynced(payload)
                    }
                } catch (error) {

                }
            })

            pp.map((s) => {
                getSocket().off(`new-order-${s?._id}`)
                getSocket().on(`new-order-${s?._id}`, async ({ pointOfSale_id: pos, order }) => {

                    try {

                        if (order?.orderOrigin !== "pos") {
                            let a = {
                                _id: order._id,
                                orderNumber: order?.orderNumber || new Date().getTime() + '',
                                nextInKitchen: 0,

                                numberPeople: 1,
                            }
                            const realm = await Realm.open(realmConfig)
                            //const pointOfSale = realm.objects('PointOfSale').filtered('_id == $0', new Realm.BSON.ObjectId(pos))[0]
                            if (order?.typeOrder == 'on_spot') {

                                a.type = 'onsite';
                                a.unit = realm.objects('Unit').filtered('_id == $0', new Realm.BSON.ObjectId(order?.unit))[0]
                                a.zone = realm.objects('Zone').filtered('nameSlug == $0', a?.unit?.localization)[0]
                            } else if (order?.typeOrder === "click_collect") {
                                a.type = 'collect';
                            } else {
                                a.type = 'online';
                            }
                            a.commandProduct = []
                            for (const o of order?.orderLines) {
                                for (let i = 0; i < o.quantity; i++) {
                                    const product = await realm.objects('CategoryItems').filtered('_id == $0', new Realm.BSON.ObjectId(o?.product))[0]
                                    a.commandProduct = [...a.commandProduct, {
                                        clickCount: 1,
                                        product,
                                        sent: 0,
                                        orderClassifying: 1,
                                        status: "new",
                                    }]

                                }
                            }


                            if (a) {
                                const master = await AsyncStorage.getItem('MasterDevices')
                                const glovoTickets = await AsyncStorage.getItem('glovoTickets')
                                const managerTickets = await AsyncStorage.getItem('managerTickets')
                                if (master == 'true') {
                                    store.dispatch(createOrder(JSON.parse(JSON.stringify({ order: { ...a, origin: 'manager', pointOfSale: s }, currentRestaurant: s?._id }))))


                                    if (glovoTickets == 'true' || managerTickets == 'true') {

                                        if (a?.commandProduct?.map((e) => e?.orderClassifying).every((f) => f <= a?.nextInKitchen))
                                            return

                                        let ord = JSON.parse(JSON.stringify(store?.getState()?.order?.orders))
                                        store.dispatch(sendAllToKitchen({ orderNumber: a?.orderNumber }))

                                        const printer = store?.getState().printer?.printer
                                        printer?.map((e) => {

                                            if (e?.main) {
                                                return null
                                            }
                                            if (!e?.enbaled) {
                                                return null
                                            }

                                            const payload = getPayloadProduction({ pointOfSale: a?.pointOfSale, user: {}, orders: ord, orderNumber: a?.orderNumber, productionTypes: e?.productionTypes, reprint: 0, NextInKitchen: a?.nextInKitchen })

                                            if (payload)
                                                ThermalPrinterModule.printTcp({
                                                    ip: e?.ipAdress,
                                                    port: e?.port,
                                                    autoCut: e?.autoCut,
                                                    openCashbox: e?.openCashbox,
                                                    printerNbrCharactersPerLine: e?.printerNbrCharactersPerLine,
                                                    payload,
                                                    timeout: 3000
                                                }).catch((err) => {
                                                    console.log({ err })
                                                    alert(`Impossible de se connecter a l'imprimante : (${e?.name})`)
                                                })

                                        })
                                    }

                                }


                            }
                        }
                    } catch (error) {
                        console.log({ socketError: error })
                    }
                })

                getSocket()?.off(`local-new-order:${s?._id}`)
                getSocket()?.off(`new-status-booking-${s?._id}`)
                getSocket()?.off(`update-command-kitchen:${s?._id}`)
                getSocket()?.off(`update-status-kitchen:${s?._id}`)
                getSocket()?.off(`pay-command:${s?._id}`)
                getSocket()?.off(`connect`)
                getSocket()?.on(`connect`, () => {
                    store.dispatch(getAllBookingOfDay(s?._id))
                })
                getSocket()?.on(`new-status-booking-${s?._id}`, data => {

                    if (data?.booking?.status == 'check-in')
                        store.dispatch(bookingOrderCreation(data?.booking))
                })

                getSocket()?.on(`edit-booking-${s?._id}`, data => {

                    if (data?.booking?.status == 'check-in')
                        store.dispatch(bookingOrderCreation(data?.booking))
                })

                getSocket()?.on(`new-booking-${s?._id}`, data => {

                    if (data?.booking?.status == 'check-in')
                        store.dispatch(bookingOrderCreation(data?.booking))
                })

                getSocket()?.on(`local-new-order:${s?._id}`, async (data) => {
                    console.warn('local new booking')
                    if (id != data?.id && data?.bookingId) {
                        store.dispatch(createOrder({ order: data.o, currentRestaurant: new Realm.BSON.ObjectId(s?._id), disableSocket: true }))
                    }

                })

                getSocket().on(`update-command-kitchen:${s?._id}`, async (data) => {

                    if (id != data?.DeviceId) {
                        const { id, type, value } = data
                        CommandController.updateCommandKitchen(Realm.BSON.ObjectId(id), type, value)
                    }
                })

                getSocket().on(`update-status-kitchen:${s?._id}`, async (data) => {

                    if (id != data?.DeviceId) {
                        const { ids } = data
                        CommandController.updateCommandStatus(ids)
                    }

                })
                getSocket().on(`pay-command:${s?._id}`, async (data) => {
                    if (id != data?.DeviceId) {
                        const { id, payType, amount, useTCP, roomNumber, firstName, lastName, phone, email, products } = data
                        CommandController.payCommand(id, payType, amount, useTCP, roomNumber, firstName, lastName, phone, email, products)
                    }
                })
            })

            TinyEmiter.off('GETDEVICES');
            TinyEmiter.off('SENDDATA');
            TinyEmiter.off('MESSAGE');

            TinyEmiter.on('GETDEVICES', () => {
                TinyEmiter.emit('DEVICES', devices)
            })

            TinyEmiter.on('SENDDATA', (data) => {
                sendDATA({ devices, data, event: data?.event })
            })

            TinyEmiter.on('MESSAGE', (data) => {
            })

            TinyEmiter.on('DECONNECT_FROM_ALL', (data) => {
                devices[data]?.close()
                //devices[data]?.destroy()
                delete devices[data]
            })

            TinyEmiter.on('GET_DEVICES_STATE', (data) => {
                sendDATA({ devices, event: 'getDeviceState' })
            })
            TinyEmiter.on('SENDORDER', (data) => {
                sendDATA({ devices, event: 'SENDORDER' })
            })
            TinyEmiter.on('RECEIVEDDORDERS', (data) => {
                sendDATA({ devices, data, event: 'RECEIVEDDORDERS' })
            })
            TinyEmiter.on('DO_YOU_HAVE_THIS_COMMAND', (data) => {
                sendDATA({ devices, data })
            })

            clearInterval(intId)
            unsubscribe()
            unsubscribe = NetInfo.addEventListener(async state => {
                const master = await AsyncStorage.getItem('MasterDevices')
                if (state.isConnected && state.type == 'wifi') {

                    if (master == 'true') {
                        SendMessage({ event: 'RE_CONNECT_TO_ME' });
                    } else {
                        SendMessage({ event: 'CONNECT_TO_ME' });
                    }
                } else { }
            });
        });

    } catch (error) { }

};


const options = {
    taskName: 'Example',
    taskTitle: 'Openflow',
    taskDesc: 'Background Task Services',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#ccc',
    parameters: {
        delay: 1000,
    },
};
const TCPBackground = () => {
    const pp = useSQLQuery('PointOfSale')
    useEffect(() => {

        if (BackgroundService?.isRunning()) {

            BackgroundService?.stop()?.then(() => {
                BackgroundService?.start(VeryIntensiveTask, { ...options, parameters: { pp: JSON.parse(JSON.stringify(pp)) } })
            })
        } else {
            BackgroundService?.start(VeryIntensiveTask, { ...options, parameters: { pp: JSON.parse(JSON.stringify(pp)) } })
        }

    }, [])
    return (<View />)
}

export {
    TCPBackground,
    VeryIntensiveTask
};

