import DeviceInfo from 'react-native-device-info';
import Snackbar from 'react-native-snackbar';
import {
    RTCPeerConnection,
    RTCSessionDescription
} from 'react-native-webrtc';
import TinyEmiter from 'tiny-emitter/instance';
import { store } from '../../redux';
import { clearOrders, createOrder, updateOrder } from '../../redux/actions/orderActions';
import { getUdpSocket } from '../Udp/services';
import { updPort } from '../config';
import TinyEmitter from 'tiny-emitter/instance'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPayloadProduction } from '../helpers';
import ThermalPrinterModule from 'react-native-thermal-printer';
import { PrinterServices } from '../realmDB/service/PrinterService';


const createPeer = async ({ devices, rinfo, data }) => {
    console.log({ log: 'create Peer start' })
    try {
        if (!devices[rinfo?.address]) {

            devices[rinfo?.address] = new RTCPeerConnection();

            devices[rinfo?.address].dc = devices[rinfo?.address].createDataChannel('channel');

            devices[rinfo?.address].dc.addEventListener('open', event => {
                Snackbar.show({
                    text: 'Connection Established',
                    duration: Snackbar.LENGTH_SHORT,
                });
                devices[rinfo?.address].dc = event.channel;
                store.dispatch({ type: 'SYNC_DATA' })
            });
            devices[rinfo?.address].dc.addEventListener('close', event => { console.log('Close+') });
            devices[rinfo?.address].dc.addEventListener('message', ({ data }) => {
                TinyEmiter.emit('MESSAGE', data)
                handleReceivedData(data);
            });


            devices[rinfo?.address].onicecandidate = e => console.error('ice candidate -', devices[rinfo?.address].localDescription);
            devices[rinfo?.address].oniceconnectionstatechange = e => {
                if (devices[rinfo?.address].iceConnectionState === 'disconnected' || devices[rinfo?.address].iceConnectionState === 'failed') {

                    if (devices[rinfo?.address].iceConnectionState == 'failed') {
                        devices[rinfo?.address].close();
                        delete devices[rinfo?.address];
                        // Snackbar.show({
                        //     text: `Connection lost with the device (${rinfo?.address}). Please check and try again`,
                        //     duration: Snackbar.LENGTH_INDEFINITE,
                        //     action: {
                        //         text: 'Reconnect',
                        //         textColor: 'green',
                        //         onPress: () => {
                        //             SendMessage({ event: 'CONNECT_TO_ME' }, rinfo?.address)
                        //             setTimeout(() => {
                        //                 SendMessage({ event: 'CONNECT_TO_ME' }, rinfo?.address)
                        //             }, 2000);
                        //         },
                        //     },
                        // });

                    }
                }
            }
            let offer = await devices[rinfo?.address].createOffer({ iceRestart: data?.iceRestart || false });
            await devices[rinfo?.address].setLocalDescription(offer);
        }


        setTimeout(() => {
            console.log({ log: 'createPeer' })
            let message = JSON.stringify({ event: 'CONNECTION_OFFER', offer: devices[rinfo?.address].localDescription });
            getUdpSocket().send(message, 0, message.length, updPort, rinfo?.address, function (err) { });
        }, 500);
    } catch (error) {
        // devices[rinfo?.address]?.close()
        // delete devices[rinfo?.address]

        // setTimeout(() => {
        //     devices[rinfo?.address]?.close()
        //     delete devices[rinfo?.address]
        //     SendMessage({ event: 'CONNECT_TO_ME' }, rinfo?.address)
        // }, 5000);
    }

}

const createAnswer = async ({ devices, rinfo, data }) => {
    try {

        if (!devices[rinfo?.address]) {
            devices[rinfo?.address] = new RTCPeerConnection();
            if (!devices[rinfo?.address].dc)
                devices[rinfo?.address].addEventListener('datachannel', event => {

                    console.log({ e: event });
                    devices[rinfo?.address].dc = event.channel;
                    devices[rinfo?.address].dc.addEventListener('open', event => {
                        store.dispatch({ type: 'SYNC_DATA' })
                        Snackbar.show({
                            text: 'Connection Established',
                            duration: Snackbar.LENGTH_SHORT,
                        });
                    });
                    devices[rinfo?.address].dc.addEventListener('close', event => { console.log('Close-') });
                    devices[rinfo?.address].dc.addEventListener('message', ({ data }) => {
                        TinyEmiter.emit('MESSAGE', data)
                        handleReceivedData(data);
                    });
                });

            devices[rinfo?.address].onicecandidate = e => console.error('ice candidate +', devices[rinfo?.address].localDescription);
            devices[rinfo?.address].oniceconnectionstatechange = e => {
                if (devices[rinfo?.address].iceConnectionState === 'disconnected' || devices[rinfo?.address].iceConnectionState === 'failed') {
                    console.warn('Connection lost. Attempting to reconnect...', devices[rinfo?.address].iceConnectionState);
                    if (devices[rinfo?.address].iceConnectionState == 'failed') {
                        devices[rinfo?.address].close();
                        delete devices[rinfo?.address];
                        // Snackbar.show({
                        //     text: `Connection lost with the device (${rinfo?.address}). Please check and try again`,
                        //     duration: Snackbar.LENGTH_INDEFINITE,
                        //     action: {
                        //         text: 'Reconnect',
                        //         textColor: 'green',
                        //         onPress: () => {
                        //             SendMessage({ event: 'CONNECT_TO_ME' }, rinfo?.address)
                        //             setTimeout(() => {
                        //                 SendMessage({ event: 'CONNECT_TO_ME' }, rinfo?.address)
                        //             }, 2000);
                        //         },
                        //     },
                        // });

                    }
                }
            }

            const offerDescription = new RTCSessionDescription(data?.offer);
            devices[rinfo?.address].setRemoteDescription(offerDescription);
            let answer = await devices[rinfo?.address].createAnswer();
            await devices[rinfo?.address].setLocalDescription(answer);
        }
        setTimeout(() => {
            console.log({ log: 'createAnswer' })
            let message = JSON.stringify({ event: 'CONNECTION_AMSWER', answer: devices[rinfo?.address].localDescription });
            getUdpSocket().send(message, 0, message.length, updPort, rinfo?.address, function (err) { });
        }, 500);


    } catch (error) {
        console.log({ createAnswer: error })
        // devices[rinfo?.address]?.close()
        // delete devices[rinfo?.address]
        // setTimeout(() => {
        //     devices[rinfo?.address]?.close()
        //     delete devices[rinfo?.address]
        //     SendMessage({ event: 'CONNECT_TO_ME' }, rinfo?.address)
        // }, 5000);
    }
}

const setAnswer = async ({ devices, rinfo, data }) => {


    try {
        if (devices[rinfo?.address]?.connectionState != "connected" && devices[rinfo?.address]?.connectionState != "completed") {
            setTimeout(async () => {
                console.log({ log: 'setAnswer' })
                const offerDescription = new RTCSessionDescription(data?.answer);
                await devices[rinfo?.address]?.setRemoteDescription(offerDescription);
            }, 500);
        } else {
            Snackbar.show({
                text: 'Connection Established',
                duration: Snackbar.LENGTH_SHORT,
            });
        }
    } catch (error) {
        console.log({ setAnswer: error })
        devices[rinfo?.address]?.close()
        delete devices[rinfo?.address]
        // setTimeout(() => {
        //     devices[rinfo?.address]?.close()
        //     delete devices[rinfo?.address]
        //     SendMessage({ event: 'CONNECT_TO_ME' }, rinfo?.address)
        // }, 5000);
    }

}

const handleReceivedData = async (d) => {
    let { data = {}, event } = JSON.parse(d);
    // ToastAndroid.showWithGravity('NEW DATA !!!', ToastAndroid.SHORT, ToastAndroid.TOP)

    const master = await AsyncStorage.getItem('MasterDevices')
    try {
        if (event == 'order') {
            store.dispatch(createOrder({ order: data?.data?.o, currentRestaurant: new Realm.BSON.ObjectId(data?.data?._id), disableSocket: true, sendToServer: true }))
            if (master == 'true') {
                const id = await DeviceInfo.getDeviceId();
                //TinyEmitter.emit('SENDDATA', { data: { o: { ...data?.data?.o, eventType: 'createCommand' }, id, }, _id: data?.data?._id })
            }

        } else if (event == 'getDeviceState') {
            const info = {
                brand: await DeviceInfo.getBrand(),
                model: await DeviceInfo.getModel(),
                model: await DeviceInfo.getModel(),
                systemVersion: await DeviceInfo.getSystemVersion(),
                uniqueId: await DeviceInfo.getUniqueId(),
                deviceName: await DeviceInfo.getDeviceName(),
                deviceType: await DeviceInfo.getDeviceType(),
                systemName: await DeviceInfo.getSystemName(),
                manufacturer: await DeviceInfo.getManufacturer(),
                buildId: await DeviceInfo.getBuildId(),
                isEmulator: await DeviceInfo.isEmulator(),
                isTablet: await DeviceInfo.isTablet(),
                userAgent: await DeviceInfo.getUserAgent(),
                version: await DeviceInfo.getVersion(),
                ipAddress: await DeviceInfo.getIpAddress(),
                macAddress: await DeviceInfo.getMacAddress(),
                totalMemory: await DeviceInfo.getTotalMemory(),
                freeDiskStorage: await DeviceInfo.getFreeDiskStorage(),
                totalDiskCapacity: await DeviceInfo.getTotalDiskCapacity(),
                BatteryLevel: await DeviceInfo.getBatteryLevel(),
                user: store?.getState()?.stuff?.activeStuff || {},
                totalOrder: 0// store?.getState()?.order?.orders?.length || 0

            };
            TinyEmiter.emit('SENDDATA', { data: JSON.parse(JSON.stringify(info)), event: 'setDeviceState' })
        } else if (event == 'statusChanging') {
            store.dispatch(updateOrder({ p: data?.p, type: 'status', orderNumber: data?.orderNumber, turnOn: true }))
        } else if (event == 'setDeviceState') {
            TinyEmiter.emit('DVC', data)
        } else if (event == 'DO_YOU_HAVE_THIS_COMMAND') {
            console.log({ doyouhavethiscommand: data })
        } else if (event == 'PRINTER_TICKET_MAIN') {
            PrinterServices.getPrinterByPointOfSale({
                _id: data?.pointOfSale?._id,
                callback: (p) => {

                    p?.map((e) => {
                        if (!e?.main) {
                            return null
                        }
                        if (!e?.enbaled) {
                            return null
                        }

                        const payload = getPayloadProduction({ ...data, productionTypes: e?.productionTypes, /*selectOrder?.nextInKitchen*/ })
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
                                alert(`Impossible de se connecter a l'imprimante : (${e?.name})`)
                            })

                    })
                }
            })

        } else if (event == 'PRINTER_TICKET_PRODCUTOIN') {
            PrinterServices.getPrinterByPointOfSale({
                _id: data?.pointOfSale?._id,
                callback: (p) => {
                    console.log({ Printer: p })
                    p?.map((e) => {
                        if (e?.main) {
                            return null
                        }
                        if (!e?.enbaled) {
                            return null
                        }

                        const payload = getPayloadProduction({ ...data, productionTypes: e?.productionTypes, /*selectOrder?.nextInKitchen*/ })
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
                                alert(`Impossible de se connecter a l'imprimante : (${e?.name})`)
                            })

                    })
                }
            })

        } else if (event == 'SENDORDER') {
            if (master != "true")
                return
            const a = store.getState().order
            TinyEmiter.emit('RECEIVEDDORDERS', { data: JSON.parse(JSON.stringify(a.orders)), event: 'RECEIVEDDORDERS' })
        } else if (event == "RECEIVEDDORDERS") {
            if (master == "true")
                return
            for (const o of data.data) {

                await new Promise((res, rej) => { setTimeout(() => { res() }, 400); })
                store.dispatch(createOrder({ order: o, currentRestaurant: new Realm.BSON.ObjectId(o?.pointOfSale?._id), disableSocket: true, sendToServer: true }))
            }
        } else if (event == 'CLEARORDERS') {

            store.dispatch(clearOrders())
            if (master == "true") {

            }
        }
    } catch (error) {
        console.log({ error });
    }
}

const sendDATA = ({ devices, data, event = 'order' }) => {

    Object.keys(devices).map((e) => {
        devices[e]?.dc?.send(JSON.stringify({ data, event }));
    });
}

const geWebRTCtDevices = (devices) => {
    return devices
}

export {
    createAnswer,
    createPeer,
    geWebRTCtDevices,
    sendDATA,
    setAnswer
};

