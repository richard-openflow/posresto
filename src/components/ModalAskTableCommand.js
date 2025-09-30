import { Modal, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Feather from "react-native-vector-icons/Feather"
import { useDispatch, useSelector } from 'react-redux'
import { navigate } from '../../NavigationService'
import { CommandController } from '../utils/realmDB/service/commandService'
import { hideModalActionTableMap } from '../redux/actions/ModalReducer'
import moment from 'moment'
import { Snackbar } from 'react-native-paper'
import { createOrder, getBookingInformationToOrder } from '../redux/actions/orderActions'
import { BSON } from 'realm'
import { getOrderObject } from '../utils/helpers'

const ModalAskTableCommand = ({ isLinked }) => {
    const [ords, setOrds] = useState([])
    const dispatch = useDispatch()
    const { showTableModal, unit } = useSelector(state => state.Modal)
    const { tempoBooking } = useSelector(state => state.order)
    const { currentRestaurant } = useSelector(state => state.user)
    const { activeStuff } = useSelector(state => state.stuff)
    const { orders } = useSelector(state => state.order)
    useEffect(() => {
        (async () => {
            if (showTableModal) {
                const o = await CommandController.getUnPaidCommmand({ orders, pointOfSaleId: currentRestaurant?._id, dt: moment().format('YYYY/MM/DD'), unitId: unit?._id })

                setOrds(o)

            }
        })()
    }, [showTableModal, unit])


    return (
        <Modal visible={showTableModal} transparent statusBarTranslucent>
            <TouchableHighlight underlayColor onPress={() => dispatch(hideModalActionTableMap())} style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: '#00000020', justifyContent: "center", alignItems: 'center' }}>

                    <View style={{ backgroundColor: 'white' }}>

                        {tempoBooking?._id && <View style={{ flexDirection: 'row', padding: 5, gap: 5, justifyContent: 'center', alignItems: 'center' }}>
                            <Text>{tempoBooking?.customer?.firstName}</Text>
                            <Text>{tempoBooking?.customer?.lastName}</Text>
                        </View>}
                        {tempoBooking?._id && <View style={{ flexDirection: 'row', gap: 5, justifyContent: 'center', alignItems: 'center' }}>
                            <Text> Number of guests: </Text>
                            <Text>{tempoBooking?.nbrPeople}</Text>
                        </View>}
                        {ords?.length != 0
                            &&
                            <TouchableHighlight onPress={async () => {
                                const order = ords[ords?.length - 1]

                                if (!(order?.commandProduct?.map((e) => e?.orderClassifying).every((f) => f <= order?.nextInKitchen))) {
                                    alert("You need to send all the products to kitchen or delete unsent product ")
                                    return
                                }
                                dispatch(hideModalActionTableMap())

                                if (ords?.length == 0) {
                                    alert('No unpaid Comand found')
                                } else {
                                    dispatch({ type: 'SHOW_PAY_TYPE', payload: order?.orderNumber })
                                }
                            }}>
                                <View style={{ borderWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, paddingHorizontal: 50, paddingVertical: 25 }}>
                                    <Text style={{ paddingHorizontal: 15 }}>Pay</Text>
                                    <Feather name={'arrow-right'} />
                                </View>
                            </TouchableHighlight>}
                        <TouchableHighlight onPress={async () => {
                            if (isLinked && ords?.length == 0) {
                                alert('You are in mode Connect, yo cannot open table')
                                return
                            }
                            if (ords?.length > 0) {
                                dispatch(hideModalActionTableMap())
                                navigate('control', { orderNumber: ords[ords?.length - 1]?.orderNumber })

                            } else if (ords?.length == 0) {

                                const a = await getOrderObject({
                                    commandProduct: [],
                                    type: "onsite",
                                    origin: 'pos',
                                    orderNumber: moment().valueOf(),
                                    pointOfSale: currentRestaurant,
                                    user: activeStuff,
                                    nextInKitchen: 0,
                                    unit,
                                    _id: new BSON.ObjectId()
                                })
                                dispatch(createOrder({
                                    order: {
                                        ...a,
                                        ...
                                        (tempoBooking?.status == 'check-in' ?
                                            {
                                                bookingId: tempoBooking?._id,
                                                firstName: tempoBooking?.customer?.firstName,
                                                lastName: tempoBooking?.customer?.lastName,
                                                email: tempoBooking?.customer?.email,
                                                phone: tempoBooking?.customer?.phone,
                                                numberPeople: tempoBooking?.nbrPeople
                                            } : {}
                                        )
                                        ,
                                        currentRestaurant: currentRestaurant?._id
                                    }
                                }))
                                dispatch(hideModalActionTableMap())
                                navigate('control', { orderNumber: a?.orderNumber })
                            }
                        }}>
                            <View style={{ borderWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, paddingHorizontal: 50, paddingVertical: 25 }}>
                                <Text style={{ paddingHorizontal: 15 }}>{ords?.length == 0 ? 'Open Table' : 'order'}</Text>
                                <Feather name={'arrow-right'} />
                            </View>
                        </TouchableHighlight>
                        {ords?.length != 0 &&
                            <TouchableHighlight onPress={async () => {
                                dispatch(hideModalActionTableMap())
                                if (ords?.length == 0) {
                                    alert('No unpaid Command found')
                                } else if (ords?.length > 0) {
                                    const i = ords[ords?.length - 1]?._id
                                    dispatch(hideModalActionTableMap(i))
                                    alert('Select where you want to transfer the command')


                                }
                            }}>
                                <View style={{ borderWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, paddingHorizontal: 50, paddingVertical: 25 }}>
                                    <Text style={{ paddingHorizontal: 15 }}>Transfer</Text>
                                    <Feather name={'arrow-right'} />
                                </View>
                            </TouchableHighlight>}

                    </View>
                </View>
            </TouchableHighlight>
        </Modal >
    )
}

export { ModalAskTableCommand }

const styles = StyleSheet.create({})