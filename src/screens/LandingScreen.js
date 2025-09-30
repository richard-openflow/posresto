import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect } from 'react'
import { Image, Modal, ScrollView, Text, TouchableHighlight, View } from 'react-native'
import { MMKV } from 'react-native-mmkv'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useDispatch, useSelector } from 'react-redux'
import { navigate } from '../../NavigationService'
import { getBoxInformationSuccess } from '../redux/actions/BoxInformationActions'
import { getMenu, getMenuSuccess } from '../redux/actions/menuAction'
import { getAllBookingOfDay, getOrderSuccess, setUniqueIdOfDevice } from '../redux/actions/orderActions'
import { getPrinterSuccess } from '../redux/actions/printerActions'
import { getProductionTypesSuccess } from '../redux/actions/ProductionTypesAction'
import { getEmployeeStuff, setEmployeeStuffSuccess } from '../redux/actions/StuffEmployeeAction'
import { getTable, getTableSuccess } from '../redux/actions/tableAction'
import { confirmaccessByToken, defineMasteringType, isLinkedToOrder, setCurrentRestaurant, setUserRole } from '../redux/actions/userActions'
import { getZoneSuccess } from '../redux/actions/zoneAction'
import { colors } from '../theme/Styles'
import { getUniqueId } from '../utils/helpers'
import { useQuery } from '../utils/realmDB/store'

const LandingScreen = () => {
    const pp = useQuery('PointOfSale')
    const user = useQuery('User')
    const printer = useQuery('Printer')
    const stuff = useQuery('User')
    const menu = useQuery('Menu')
    const zone = useQuery('Zone')
    const table = useQuery('Unit')
    const productionTypes = useQuery('ProductionTypes')
    const orders = useQuery('Orders')//.filtered('pointOfSale._id == $0', new Realm.BSON.ObjectID(currentRestaurant))
    const cashBox = useQuery('BoxInformation')
    const storage = new MMKV({ id: 'pointOfSale' })
    const dispatch = useDispatch()
    const { currentRestaurant } = useSelector(state => state.user)

    useEffect(() => {
        AsyncStorage.getItem('updated').then((data) => {
            if (data != "done") {
                pp?.map((f) => {
                    dispatch(getMenu({ pointOfSaleId: f?._id }));
                    dispatch(getTable({ pointOfSaleId: f?._id }));
                    dispatch(getEmployeeStuff({ pointOfSaleId: f?._id }));
                })
                AsyncStorage.setItem('updated', 'done')
            }
        })

    }, [pp])

    useEffect(() => {
        if (user?.length > 0) {
            dispatch(confirmaccessByToken({ user: JSON.parse(JSON.stringify(user[0])), restaurants: [] }))
        }
    }, [user])


    useEffect(() => {
        try {
            let cr = JSON.parse(storage.getString('pos'))

            if (currentRestaurant || cr?._id) {

                navigate('control')
            }
        } catch (error) {

        }
    }, [currentRestaurant])


    return (
        <ScrollView contentContainerStyle={{ padding: 15, flexDirection: 'row', flexWrap: 'wrap' }}>
            {[...pp]?.map((item, index) => {
                return (
                    <View key={index} style={{ backgroundColor: "white", justifyContent: "center", alignItems: "center", paddingVertical: 10, flexGrow: 1, margin: "0.5%", width: "48%" }}>
                        <Image source={{ uri: "https://api.openflow.pro/" + item?.logo?.path }} style={{ width: 75, height: 75, borderRadius: 50, padding: 50, objectFit: 'scale-down' }} />
                        <View style={{ justifyContent: "center", alignItems: "center", marginTop: 20 }}>
                            <Text style={{ color: colors.primary, fontSize: 25 }}>{item?.title}</Text>
                            <Text style={{ color: colors.primary }}>{item?.address}</Text>
                            <Text style={{ color: colors.primary, marginTop: 10 }}>+{item.phone}</Text>
                            <Text style={{ color: colors.primary }}>{item.email}</Text>
                            <Text style={{ color: colors.primary }}>{item.ice}</Text>
                        </View>
                        <View style={{ justifyContent: "center", alignItems: "center", marginTop: 20 }}>
                            <TouchableHighlight
                                accessibilityLabel={`see-restaurant-button-${index}`}
                                testID={`see-restaurant-button-${index}`}
                                underlayColor onPress={async () => {
                                    dispatch(getPrinterSuccess(JSON.parse(JSON.stringify(printer?.filtered('pointOfSale._id == $0', new Realm.BSON.ObjectID(item?._id))))))
                                    dispatch(setEmployeeStuffSuccess(JSON.parse(JSON.stringify(stuff?.filtered('pointOfSale._id == $0', new Realm.BSON.ObjectID(item?._id))))))
                                    dispatch(getMenuSuccess(JSON.parse(JSON.stringify(menu?.filtered('pointOfSale._id == $0', new Realm.BSON.ObjectID(item?._id))))))
                                    dispatch(getZoneSuccess(JSON.parse(JSON.stringify(zone?.filtered('pointOfSale._id == $0', new Realm.BSON.ObjectID(item?._id))))))
                                    dispatch(getTableSuccess(JSON.parse(JSON.stringify(table?.filtered('pointOfSale._id == $0', new Realm.BSON.ObjectID(item?._id))))))
                                    dispatch(getProductionTypesSuccess(JSON.parse(JSON.stringify(productionTypes?.filtered('pointOfSale._id == $0', new Realm.BSON.ObjectID(item?._id))))))
                                    dispatch(getBoxInformationSuccess(JSON.parse(JSON.stringify(cashBox?.filtered('pointOfSale._id == $0', new Realm.BSON.ObjectID(item?._id))))))
                                    dispatch(getOrderSuccess(JSON.parse(JSON.stringify(orders.filtered('pointOfSale._id == $0', new Realm.BSON.ObjectID(item?._id))))))
                                    dispatch(setUniqueIdOfDevice(await getUniqueId()))
                                    dispatch(setUserRole(await AsyncStorage.getItem('ROLE')))
                                    dispatch(defineMasteringType((await AsyncStorage.getItem('MasterDevices')) == 'true'))
                                    dispatch(isLinkedToOrder((await AsyncStorage.getItem('linkedOrder')) == 'true'))
                                    dispatch(setCurrentRestaurant(JSON.parse(JSON.stringify(item))))
                                    storage.set('pos', JSON.stringify(item))
                                    dispatch(getAllBookingOfDay(item?._id))
                                }}>
                                <View style={{ backgroundColor: colors.primary, borderRadius: 25, padding: 15 }}>
                                    <Text style={{ color: "white" }}>{item.category == "restaurant" ? "See Restaurant" : "See Room service"}</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                )
            })}
            <View style={{ position: 'absolute', top: 10, right: 10, }}>
                <TouchableHighlight onPress={async () => {

                    pp?.map((f) => {
                        dispatch(getMenu({ pointOfSaleId: f?._id }));
                        dispatch(getTable({ pointOfSaleId: f?._id }));
                        dispatch(getEmployeeStuff({ pointOfSaleId: f?._id }));
                    })

                }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary, borderRadius: 5, padding: 5, paddingHorizontal: 15 }}>
                        <AntDesign color={'white'} name={'clouddownloado'} size={18} />
                        <Text style={{ color: 'white' }}>Download</Text>
                    </View>
                </TouchableHighlight>
            </View>

        </ScrollView >
    )
}
export default LandingScreen
