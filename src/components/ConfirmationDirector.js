import React, { useEffect, useState } from 'react'
import { Modal, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { Text } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import { payOrder } from '../redux/actions/orderActions'



const ConfirmationDirector = ({ stuff, show, setShow, onConfirmed }) => {
    const { showStuffPinPad } = useSelector(state => state.Modal)
    const [unitNumber, setUnitNumber] = useState('')
    const [tp, setTp] = useState({
        sender: null,
        receiver: null
    })
    const dispatch = useDispatch()
    useEffect(() => { setUnitNumber('') }, [showStuffPinPad])

    useEffect(() => {
        setTp({
            sender: null,
            receiver: null
        })
    }, [show])
    return (
        <Modal visible={show?.show} transparent statusBarTranslucent>
            <View style={{
                flex: 1,
                backgroundColor: '#000',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <View style={{ width: 390, backgroundColor: 'white', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>


                    <View style={{ flexDirection: 'row', width: '100%', borderWidth: StyleSheet.hairlineWidth, }}>
                        <TextInput secureTextEntry placeholder='PIN' editable={false} value={unitNumber} style={{ flexGrow: 1, fontSize: 25, textAlign: 'center', color: 'red', height: 80 }} />

                        <TouchableOpacity style={{ width: '33.33%', }} onPress={async () => {
                            setUnitNumber('')
                        }}>
                            <View style={{ height: 80, justifyContent: 'center', alignItems: 'center' }} >
                                <Text style={{ color: 'black', fontSize: 14 }}>Clear</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'Clear', 0, 'OK']?.map((e) => {
                        return (
                            <TouchableOpacity key={e} style={{ width: '33.33%', }} onPress={async () => {
                                if (e == 'Cancel') {
                                    dispatch({ type: 'HIDE_KEY_PAD' })
                                } else if (e == 'Clear') {
                                    setUnitNumber('')
                                } else if (e == 'Close') {
                                    setShow(false)
                                } else if (e != 'OK') {
                                    setUnitNumber((f) => f + '' + e)
                                    if (unitNumber.length >= 3) {

                                        let a = stuff.filter((f) => f.pin == (unitNumber + '' + e))[0]
                                        if (a && a.role == 'ROLE_DIRECTOR') {
                                            dispatch(payOrder({ ...show.data }))
                                            setShow({ show: false, data: {} })
                                            setUnitNumber('')
                                        } else if (a) {
                                            setShow({ show: false, data: {} })
                                            alert('Only directors can cancel payment')
                                            setUnitNumber('')
                                        }
                                    }
                                }
                            }}>
                                <View style={{ borderWidth: StyleSheet.hairlineWidth, height: 80, justifyContent: 'center', alignItems: 'center' }} >
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
    ConfirmationDirector
}
