import React, { useEffect, useState } from 'react'
import { Modal, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getSocket } from '../utils/socket';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";

let invd = null
let unsubscribe = console.log
const ModalLostConnexion = () => {
    const [isConnected, setIsConnected] = useState(false)
    const [masterDevices, setMasterDevices] = useState(false)
    useEffect(() => {
        clearInterval(invd)
        invd = setInterval(async () => {
            const internetType = await AsyncStorage.getItem('internetType')
            setMasterDevices((await AsyncStorage.getItem('MasterDevices')) != 'true')
            if ((internetType == 'true' || internetType == null))
                setIsConnected(!getSocket()?.connected)
        }, (10 * 1000));
        unsubscribe()
        unsubscribe = NetInfo.addEventListener(async state => {
            const master = await AsyncStorage.getItem('MasterDevices')
            if (state.isConnected && state.type == 'wifi') {
                //store.dispatch({ type: 'SETWIFICONNECTED' })
                setIsConnected(true)
            } else {
                setIsConnected(false)
                //store.dispatch({ type: 'SETWIFIDESCONNECTED' })
                // clearInterval(intId)
            }
        });
    }, [getSocket()])

    return (
        <Modal transparent visible={isConnected && masterDevices} statusBarTranslucent>
            <View style={{ flex: 1, backgroundColor: '#00000055', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ minWidth: 250, backgroundColor: 'white', padding: 15, borderRadius: 5 }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <MaterialCommunityIcons name={'access-point-remove'} color={'black'} size={30} />
                        <Text style={{ fontSize: 22 }}>Connection Lost</Text>
                    </View>
                    <Text style={{ padding: 10 }}>please verify you internet connection</Text>
                </View>
            </View>
        </Modal>
    )
}

export { ModalLostConnexion }

const styles = StyleSheet.create({})