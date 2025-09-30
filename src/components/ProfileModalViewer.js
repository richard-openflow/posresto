import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, SafeAreaView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { navigate } from '../../NavigationService';
import { getMenu } from '../redux/actions/menuAction';
import { getEmployeeStuff } from '../redux/actions/StuffEmployeeAction';
import { getTable } from '../redux/actions/tableAction';
import { confirmaccess } from '../redux/actions/userActions';
import { useQuery } from '../utils/realmDB/store';
import { SendMessage } from '../utils/Udp/services';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('screen')
const ModalProfileViewer = ({ onClose, children }) => {

    const slideAnim = useRef(new Animated.Value(0)).current;
    const { showProfile } = useSelector(state => state.Modal)
    const [vis, setVis] = useState(true)
    const dispatch = useDispatch()

    useEffect(() => {
        if (showProfile) {
            // Animate in
            setVis(true)
            Animated.timing(slideAnim, {
                toValue: 1, // final position on-screen
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            // Animate out
            Animated.timing(slideAnim, {
                toValue: 0, // back to off-screen
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setVis(false)
            });
        }
    }, [showProfile, slideAnim]);

    const slideInterpolate = slideAnim.interpolate({
        inputRange: [0, 1],
        // outputRange: [-width, -width + 300], // Start from 100% (right) to 0% (center)
        outputRange: [-width, 0], // Start from 100% (right) to 0% (center)
    });
    const pp = useQuery('PointOfSale')
    const user = useQuery('User').filtered('connectedUser == true')[0]

    return (
        <Modal transparent statusBarTranslucent={true} visible={vis} animationType="none">
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.overlay}>
                    <Animated.View
                        style={[
                            styles.modalContainer,
                            { transform: [{ translateX: 0 }] },
                        ]}
                    >

                        <View style={{
                            justifyContent: 'center', alignItems: 'center', width: '100%', height,
                        }}>
                            <View style={{ width: '100%', }}>
                                <View style={{ justifyContent: 'flex-end', alignItems: 'center', width: '100%', flexDirection: 'row' }}>
                                    <TouchableHighlight style={{ width: 50, justifyContent: 'center', alignItems: 'center' }} onPress={() => { dispatch({ type: 'HIDE_PROFILE' }) }}>
                                        <MaterialCommunityIcons name={'close'} color={'red'} size={30} style={{ paddingVertical: 10 }} />
                                    </TouchableHighlight>
                                </View>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', borderColor: '#00000090', borderWidth: StyleSheet.hairlineWidth, padding: 16, }}>
                                <FastImage style={{ width: 90, height: 90, borderRadius: 40 }} source={{ uri: 'https://api.openflow.pro/' + user?.avatar?.path }} />
                                <Text style={{ color: 'black' }}>{user?.firstName} {user?.lastName}</Text>
                                <Text style={{ color: 'black' }}>{user?.email} | +{user?.phone}</Text>
                                <Text style={{ fontSize: 13 }}>Version 0.0.50</Text>
                            </View>

                            {/* <View style={{ flexGrow: 1 }} /> */}
                            <View style={{ justifyContent: 'center', alignItems: 'flex-start', width: '100%', borderColor: '#00000090', borderWidth: StyleSheet.hairlineWidth, }}>
                                <TouchableHighlight style={{ width: '100%', }} onPress={() => { dispatch({ type: 'HIDE_PROFILE' }); navigate('landing'); }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10, width: '100%', }}>
                                        <MaterialCommunityIcons name={'sign-real-estate'} style={{ height: 25, justifyContent: "center", alignItems: 'center' }} color={'black'} size={25} />
                                        <Text style={{ padding: 15 }}>Point of sales</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'flex-start', width: '100%', borderColor: '#00000090', borderWidth: StyleSheet.hairlineWidth, }}>
                                <TouchableHighlight style={{ width: '100%', }} onPress={() => { dispatch({ type: 'HIDE_PROFILE' }); navigate('settingScreen') }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10, width: '100%', }}>
                                        <EvilIcons name={'gear'} style={{ height: 25, justifyContent: "center", alignItems: 'center', paddingTop: 3 }} color={'black'} size={25} />
                                        <Text style={{ padding: 15 }}>Settings</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'flex-start', width: '100%', borderColor: '#00000090', borderWidth: StyleSheet.hairlineWidth, }}>
                                <TouchableHighlight style={{ width: '100%', }} onPress={() => {
                                    dispatch({ type: 'HIDE_PROFILE' });
                                    dispatch({ type: 'SHOW_RAPPORT_MODAL' })
                                }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10, width: '100%', }}>
                                        <MaterialCommunityIcons name={'notebook'} style={{ height: 25, justifyContent: "center", alignItems: 'center' }} color={'black'} size={25} />
                                        <Text style={{ padding: 15 }}>Print The Report</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'flex-start', width: '100%', borderColor: '#00000090', borderWidth: StyleSheet.hairlineWidth, }}>

                                <TouchableHighlight style={{ width: '100%', }} onPress={() => {
                                    dispatch({ type: 'HIDE_PROFILE' }); SendMessage({ event: 'CONNECT_TO_ME' });
                                    // setTimeout(() => {
                                    //     SendMessage({ event: 'CONNECT_TO_ME' })
                                    // }, 2000);
                                }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10, width: '100%', }}>
                                        <MaterialCommunityIcons name={'devices'} style={{ height: 25, justifyContent: "center", alignItems: 'center' }} color={'black'} size={25} />
                                        <Text style={{ padding: 15 }}>Scan near devices</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                            {/* <View style={{ justifyContent: 'center', alignItems: 'flex-start', width: '100%', borderColor: '#00000090', borderWidth: StyleSheet.hairlineWidth, }}>

                                <TouchableHighlight style={{ width: '100%', }} onPress={() => {
                                    dispatch({ type: 'SYNC_DATA' });
                                    dispatch({ type: 'HIDE_PROFILE' });

                                }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10, width: '100%', }}>
                                        <MaterialCommunityIcons name={'circle'} style={{ height: 25, justifyContent: "center", alignItems: 'center' }} color={'black'} size={25} />
                                        <Text style={{ padding: 15 }}>Sync Data</Text>
                                    </View>
                                </TouchableHighlight>
                            </View> */}
                            <View style={{ justifyContent: 'center', alignItems: 'flex-start', width: '100%', borderColor: '#00000090', borderWidth: StyleSheet.hairlineWidth, }}>
                                <TouchableHighlight style={{ width: '100%', }} onPress={() => {
                                    dispatch({ type: 'HIDE_PROFILE' });
                                    pp?.map((f) => {
                                        dispatch(getMenu({ pointOfSaleId: f?._id }));
                                        dispatch(getTable({ pointOfSaleId: f?._id }));
                                        dispatch(getEmployeeStuff({ pointOfSaleId: f?._id }));
                                    })

                                }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: 10, width: '100%', }}>
                                        <MaterialCommunityIcons name={'arrow-down-thick'} style={{ height: 25, justifyContent: "center", alignItems: 'center' }} color={'black'} size={25} />
                                        <Text style={{ padding: 15 }}>Download</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>

                            <View style={{ flexGrow: 1 }} />
                            {/* <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', borderColor: '#00000090', borderWidth: StyleSheet.hairlineWidth, }}>
                                <TouchableHighlight style={{ width: '100%', }} onPress={async () => {
                                    dispatch({ type: 'HIDE_PROFILE' });
                                    dispatch(confirmaccess(null, null, []))
                                    await AsyncStorage.clear()
                                }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingLeft: 10 }}>
                                        <Text style={{ padding: 15 }}>Log Out</Text>
                                    </View>
                                </TouchableHighlight>
                            </View> */}
                            <View style={{ height: 60, justifyContent: 'center', alignItems: 'center' }}>
                                <Text> </Text>
                            </View>
                        </View>

                    </Animated.View>

                    <TouchableHighlight underlayColor onPress={() => { dispatch({ type: 'HIDE_PROFILE' }) }} style={{ backgroundColor: 'transparent', flexGrow: 1 }} >
                        <View></View>
                    </TouchableHighlight>
                </View >
            </SafeAreaView>
        </Modal >
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        flexDirection: 'row'
    },
    modalContainer: {
        width: 300,
        height: '100%',
        backgroundColor: 'white',
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: 'lightgrey',
        alignSelf: 'center',
    },
});


export { ModalProfileViewer };
