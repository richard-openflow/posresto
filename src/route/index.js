
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import LoginScreen from '../screens/login';
import Historique from '../screens/Historique';
import commande from '../screens/commande';
import ControlScreen from '../screens/control';
import LandingScreen from '../screens/LandingScreen';
import MenuScreen from '../screens/menuScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Barre from '../components/barre'
import { NavigationContainer } from '@react-navigation/native'
import { navigationRef } from '../../NavigationService';
import PagerCommande from '../screens/pagerCommande';
import { NetworkInfo } from 'react-native-network-info';
// import TableMap from '../components/tableMap';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SettingScreen } from '../screens/SettingScreen';
import { TCPBackground } from '../utils/background/Worker';
import { KitchenScreen } from '../screens/kitchen';
import { ModalPayCommand } from '../components/ModalPayCommand';
import { RapportModalType } from '../components/RapportModalType';
import { LoadingDownloading } from '../components/loadingDownloading';
import { TabletMapOptimized } from '../screens/TabletMapOptimized';
// import { ModalLostConnexion } from '../components/ModalLostConnexion';
import { Text, View } from 'react-native';
import TinyEmitter from "tiny-emitter/instance"
import { orderBeenSynced, orderHasBeenSaved } from '../redux/actions/orderActions';

const Home = createNativeStackNavigator();
const Stack = createNativeStackNavigator();
let idInter
let idstate
const Routing = () => {
    const [token, setToken] = useState(null)
    const { user, isMaster } = useSelector(e => e.user)


    const dispatch = useDispatch()
    AsyncStorage.getItem('token').then((e) => setToken(e))
    useEffect(() => {
        AsyncStorage.getItem('showImage').then((e) => dispatch({ type: 'SET_SETTING', payload: e == 'true' ? true : false }))
    }, [])


    return (
        <NavigationContainer
            onStateChange={(event) => { }}
            ref={navigationRef}>
            {(!user && !token) ?
                <Stack.Navigator>
                    <Stack.Screen name="login" component={LoginScreen} options={{ headerShown: false }} />
                </Stack.Navigator>
                :
                <HomeStack />
            }
        </NavigationContainer>
    )
}

const HomeStack = ({ navigation }) => {
    const { showKeyPad } = useSelector(state => state.Modal)
    const { isMaster } = useSelector(state => state.user)
    const [isOnline, setIsOnline] = useState(false)
    const dispatch = useDispatch()
    const { showModalRapport } = useSelector(state => state?.Modal)

    useEffect(() => {
        clearInterval(idInter)
        clearInterval(idstate)

        TinyEmitter.off('sync-order')
        TinyEmitter.on('sync-order', (data) => {
            dispatch(orderBeenSynced(data))
        })


        TinyEmitter.off('saved-order')
        TinyEmitter.on('saved-order', (data) => {
            dispatch(orderHasBeenSaved(data))
        })



        TinyEmitter.off('DEVICES')
        TinyEmitter.on('DEVICES', async (data) => {
            if (Object.keys(data).length > 0) {
                setIsOnline(true)
            } else {
                setIsOnline(false)
            }
        })

        setTimeout(() => {
            TinyEmitter.emit('GET_DEVICES_STATE')
            TinyEmitter.emit('GETDEVICES')
        }, 2000);

        idInter = setInterval(() => {
            TinyEmitter.emit('GETDEVICES')
        }, 5 * 1000);

        idstate = setInterval(() => {
            TinyEmitter.emit('GET_DEVICES_STATE')
        }, 60 * 1000);
    }, [])

    return (
        <>
            {!isMaster &&
                <View style={{ backgroundColor: isOnline ? 'limegreen' : "red", width: 10, height: 10, borderRadius: 10, position: "absolute", right: 1, top: 1, zIndex: 10 }} />}
            <Home.Navigator>
                <Home.Screen name="landing" component={LandingScreen} options={{ headerShown: false, tabBarVisible: false }} />
                <Home.Screen name="control" component={ControlScreen} options={{ headerShown: false, tabBarVisible: false }} />
                <Home.Screen name="Menu" component={MenuScreen} options={{ headerShown: false, tabBarVisible: false }} />
                <Home.Screen name="Historique" component={Historique} options={{ headerShown: false, tabBarVisible: false }} />
                <Home.Screen name="commande" component={commande} options={{ headerShown: false, tabBarVisible: false }} />
                <Home.Screen name="pagerCommande" component={PagerCommande} options={{ headerShown: false, tabBarVisible: false }} />
                <Home.Screen name="tableMap" component={TabletMapOptimized} options={{ headerShown: false, tabBarVisible: false }} />
                <Home.Screen name="settingScreen" component={SettingScreen} options={{ headerShown: false, tabBarVisible: false }} />
                <Home.Screen name="kitchen" component={KitchenScreen} options={{ headerShown: false, tabBarVisible: false }} />
            </Home.Navigator>
            <Barre dispatch={dispatch} showKeyPad={showKeyPad} isMaster={isMaster} />
            <TCPBackground />
            <ModalPayCommand />
            {showModalRapport && <RapportModalType />}
            <LoadingDownloading />
            {/* <ModalLostConnexion /> */}
        </>
    )
}
export default Routing

