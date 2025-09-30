import dgram from 'react-native-udp'
import { BROADCAST_ADDR, ENDOFFILE, updPort } from '../config'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '../TCP/services'

let udpSocket = null

const getUdpSocket = (cnew = false) => {
    try {
        if (udpSocket == null || cnew) {
            udpSocket = dgram.createSocket({
                type: 'udp4',
                debug: true,
            })
            // .createSocket('udp4')
            udpSocket.bind(updPort, () => {
                udpSocket.setBroadcast(true)
            })
            return udpSocket
        } else {
            return udpSocket;
        }

    } catch (error) {

    }
}



const SendMessage = async (msg) => {
    const uid = await AsyncStorage.getItem('duiid')

    let message = JSON.stringify({ ...msg, uid })
    if (msg == 'GET_ALL_NEARBY_DEVICES')
        AsyncStorage.setItem('nearbyclients', JSON.stringify([]))
    try {
        getUdpSocket().send(message, 0, message.length, updPort, BROADCAST_ADDR, function (err) { });
        // if (msg.event == "CONNECT_TO_ME")
        //     for (let i = 0; i < 510; i++) {
        //         getUdpSocket().send(message, undefined, undefined, updPort, `192.168.${parseInt(i / 255)}.${parseInt(i % 255) + 1}`, function (err) {
        //             console.log(err)
        //         });

        //     }
    } catch (error) { }
}

const SendMessageToIpAdresse = (msg, remoteHost) => {
    let message = JSON.stringify(msg)
    try {
        getUdpSocket().send(message, undefined, undefined, updPort, remoteHost, function (err) { })
    } catch (error) {

    }
}

const DestoryUdpSocket = (params) => {
    if (udpSocket != null) {
        udpSocket?.close()
        udpSocket = null;
    }
}

const sendToEveryOne = async (data) => {
    // store.dispatch({ type: "TCP_DATA_SENDING_LOADING" })
    return
    let nearyBy = await AsyncStorage.getItem('nearbyclients',)
    nearyBy = JSON.parse(nearyBy) || []
    for (let i = 0; i < nearyBy.length; i++) {
        const ip = nearyBy[i];

        createClient(ip, (Buffer.from(JSON.stringify(data)).toString('base64') + ENDOFFILE))

    }
    //createClient('192.168.1.12', (Buffer.from(JSON.stringify(data)).toString('base64') + ENDOFFILE))
    // store.dispatch({ type: "TCP_DATA_SENT_LOADING" })
}


export {
    getUdpSocket,
    DestoryUdpSocket,
    SendMessage,
    SendMessageToIpAdresse,
    sendToEveryOne
}