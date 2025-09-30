import React from 'react'
import { Dimensions, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
// import { useSQLQuery } from '../../utils/sqliteDB'
import moment from 'moment'
import Fontisto from 'react-native-vector-icons/Fontisto'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useDispatch, useSelector } from 'react-redux'
import { updateOrder } from '../redux/actions/orderActions'
import { getColor } from '../theme/Styles'

const { height, width } = Dimensions.get('screen')

const KitchenScreen = () => {
    const { orders } = useSelector(state => state.order)
    const { currentRestaurant: a } = useSelector(state => state.user)
    const dispatch = useDispatch()

    return (
        <ScrollView horizontal style={{ flexGrow: 0 }} >
            <ScrollView style={{ height: height - 100 }} >
                <View style={{ flexDirection: "row", padding: 15, gap: 15, position: 'relative', }}>
                    {orders
                        ?.filter(e => { return e?.pointOfSale?._id == a?._id })?.
                        sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt)).
                        filter((s) => s?.commandProduct.some((s) => s?.sent > 0 && s?.status != 'done' && s?.status != 'cancel')).
                        map((o) => {
                            const c = o?.commandProduct.filter((s) => s?.sent > 0 && s?.status != 'done' && s?.status != 'cancel')[0]

                            return (
                                <View style={{ elevation: 3, backgroundColor: 'white', gap: 5, minWidth: 0.32 * width, paddingBottom: 50 }}>
                                    <View style={{ flexDirection: "row", gap: 10, backgroundColor: 'black', padding: 5 }}>
                                        <View style={{ flexDirection: "row", alignItems: 'center' }}>
                                            {o?.type == 'collect' && <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 5 }}>
                                                <Fontisto color={'white'} name={'shopping-bag-1'} size={30} />
                                            </View>}
                                            {o?.type == 'onsite' && <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 5 }}>

                                                <MaterialCommunityIcons color={'white'} name={'table-furniture'} size={30} />
                                                <Text style={{ fontSize: 30, color: "white" }}>{o?.unit?.unitNumber}</Text>
                                            </View>}
                                            {o?.type == 'counter' && <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 5 }}>
                                                <MaterialCommunityIcons color={'white'} name={'cash-register'} size={30} />
                                            </View>}
                                        </View>
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                            <MaterialCommunityIcons color={'white'} name={'clock'} size={30} />
                                            <Text style={{ fontSize: 30, color: "white" }}>{moment(o?.createdAt).format('HH:mm')}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                            <MaterialCommunityIcons color={'white'} name={'food-variant'} size={30} />
                                            <Text style={{ fontSize: 30, color: "white" }}>{o?.commandProduct?.filter(c => c.sent > 0)?.length}/{o?.commandProduct?.length}</Text>
                                        </View>
                                    </View>
                                    {o?.note &&
                                        <>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
                                                <MaterialCommunityIcons color={'red'} name={'note'} size={25} />
                                                <Text style={{ color: 'black' }}>Note</Text>
                                            </View>
                                            <Text style={{ marginHorizontal: 10, color: 'red', marginBottom: 25, borderWidth: StyleSheet.hairlineWidth, padding: 5, borderRadius: 5, elevation: 1, backgroundColor: 'white' }}>{o?.note}</Text>
                                        </>
                                    }
                                    {
                                        o?.commandProduct?.
                                            filter((s) => s?.sent > 0 && s?.status != 'done').
                                            map((e) => {
                                                return (
                                                    <TouchableHighlight underlayColor onPress={() => {
                                                        dispatch(updateOrder({ p: e, type: 'status', orderNumber: o?.orderNumber }))
                                                    }}>
                                                        <View style={{ flexDirection: "column", marginHorizontal: 10 }}>
                                                            {
                                                                <View style={{ flexDirection: 'row', marginBottom: -10, zIndex: 5, }}>
                                                                    <Text style={{ fontSize: 20, color: "white", backgroundColor: 'black', borderRadius: 30, width: 30, height: 30, textAlignVertical: 'center', textAlign: 'center' }}>{e.orderClassifying}</Text>
                                                                </View>
                                                            }
                                                            <View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginLeft: 15 }}>
                                                                <Text style={{ paddingBottom: 20, borderRadius: 5, paddingVertical: 5, paddingHorizontal: 15, fontSize: 20, textDecorationLine: (e.status == 'cancel') ? 'line-through' : "none", color: "black", gap: 5, backgroundColor: getColor(e?.status) }}>{e?.product?.itemName}</Text>
                                                            </View>

                                                            {e?.product?.productionTypes?.length > 0 &&
                                                                <View style={{ flexDirection: 'row', marginTop: -15 }}>
                                                                    <Text style={{ padding: 2, fontSize: 15, color: "black", backgroundColor: 'white', borderWidth: StyleSheet.hairlineWidth, borderRadius: 2 }}>{e?.product?.productionTypes?.map((e) => e.name).join(', ')}</Text>
                                                                </View>}
                                                        </View>
                                                    </TouchableHighlight>
                                                )
                                            })
                                    }

                                </View>
                            )
                        })}
                </View>
            </ScrollView>
        </ScrollView>
    )
}

export {
    KitchenScreen
}
