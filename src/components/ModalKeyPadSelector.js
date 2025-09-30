import React, { useEffect, useState } from 'react'
import { Alert, Modal, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { Text } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { CommandController } from '../utils/realmDB/service/commandService'
import { createOrder } from '../redux/actions/orderActions'
import moment from 'moment'
import { BSON } from 'realm'
import { getOrderObject } from '../utils/helpers'
const ModalKeyPadSelector = ({ setOrderNumber, orders, activeStuff, table }) => {
    const { showKeyPad } = useSelector(state => state.Modal)
    const { currentRestaurant } = useSelector(state => state.user)

    const [unitNumber, setUnitNumber] = useState('')
    const [ords, setOrds] = useState([])

    const dispatch = useDispatch()


    return (
        <Modal visible={showKeyPad} transparent statusBarTranslucent>
            <View style={{
                flex: 1,
                backgroundColor: '#00000055',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <View style={{ width: 270, backgroundColor: 'white', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', width: '100%', borderWidth: StyleSheet.hairlineWidth, }}>
                        <TextInput placeholder='Table Number' editable={false} value={unitNumber} style={{ flexGrow: 1, fontSize: 25, textAlign: 'center', color: 'red', maxWidth: '66.66%' }} />
                        <TouchableOpacity style={{ width: '33.33%' }} onPress={() => setUnitNumber('')}>
                            <View style={{ height: 65, justifyContent: 'center', alignItems: 'center' }} >
                                <Text style={{ color: 'black', fontSize: 15 }}>CLEAR</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'Cancel', 0, 'OK']?.map((e) => {
                        return (
                            <TouchableOpacity key={e} style={{ width: '33.33%', }} onPress={async () => {
                                if (e == 'Cancel') {
                                    dispatch({ type: 'HIDE_KEY_PAD' })
                                }
                                else if (e != 'OK') {
                                    setUnitNumber((f) => f + '' + e)
                                }
                                else {
                                    const a = table.filter((e) => e?.unitNumber == unitNumber)

                                    if (a.length > 1) {
                                        alert('More than one table has the same unit number')
                                    } else if (a.length == 1) {
                                        const unit = a[0]
                                        const b = await CommandController?.getUnPaidCommmand({ orders, pointOfSaleId: currentRestaurant?._id, dt: moment().format('YYYY/MM/DD') })
                                        const o = b?.filter(e => e?.unit?._id == unit?._id)
                                        //const o = orders.filter(e => e?.unit?._id == unit?._id)


                                        if (o?.length == 1) {
                                            dispatch({ type: 'FIND_COMMAND_BY_NUMBER', payload: o[0]?.orderNumber })
                                        } else if (o?.length == 0) {
                                            Alert.alert('No Command Found', 'Would you like to create a new Command?',
                                                [{
                                                    text: 'Yes',
                                                    onPress: async () => {
                                                        const b = await getOrderObject({
                                                            commandProduct: [],
                                                            origin: 'pos',
                                                            orderNumber: moment().valueOf(),
                                                            pointOfSale: currentRestaurant,
                                                            user: activeStuff,
                                                            nextInKitchen: 0,
                                                            _id: new BSON.ObjectId(),
                                                            "type": "onsite",
                                                            unit: unit
                                                        })

                                                        dispatch(createOrder({ order: b, currentRestaurant }))
                                                        setOrderNumber(b?.orderNumber)
                                                        dispatch({ type: 'HIDE_KEY_PAD' })
                                                    }
                                                },
                                                {
                                                    text: 'No',
                                                    onPress: () => { }
                                                }]
                                            )
                                        }
                                        else {
                                            alert(`Because we found multiple unpaid orders for the same table, please navigate to the order page and select the order you'd like to proceed with.`)
                                        }
                                    } else {
                                        alert(`No Table Found.`)
                                    }

                                }

                            }}>
                                <View style={{ borderWidth: StyleSheet.hairlineWidth, height: 55, justifyContent: 'center', alignItems: 'center' }} >
                                    <Text style={{ color: 'black', fontSize: e != 'Cancel' ? 25 : 14 }}>{e}</Text>
                                </View>
                            </TouchableOpacity>

                        )
                    })}
                </View>
            </View>
        </Modal >
    )
}
export {
    ModalKeyPadSelector
}