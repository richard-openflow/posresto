import { useState } from "react"
import { Modal, ScrollView, Text, TouchableHighlight, View } from "react-native"
import { TextInput } from "react-native-paper"
import { useDispatch, useSelector } from "react-redux"
import { colors } from "../theme/Styles"
import { cancelProductInOrder, reSendAllToKitchen } from "../redux/actions/orderActions"
//import { useSQLQuery } from "../utils/realmDB/store"

const ModalCancelPremission = () => {



    // const users = useSQLQuery('User').filtered('role == "ROLE_DIRECTOR" && pointOfSale._id == $0', new Realm.BSON.ObjectId(currentRestaurant))
    const { stuff, activeStuff } = useSelector(state => state.stuff)

    const [info, setInfo] = useState({
        reason: "",
        note: "",
        pin: ''
    })
    const modal = useSelector(state => state.Modal)
    const dispatch = useDispatch()

    return (
        <Modal statusBarTranslucent transparent visible={modal.showCancelPremission}>
            <View style={{ backgroundColor: '#00000045', flex: 1, justifyContent: 'center', alignItems: "center" }}>
                <ScrollView>
                    <View style={{ backgroundColor: 'white', borderRadius: 4, width: '100%', height: '100%', padding: 16, marginTop: 10 }}>

                        <TextInput mode='outlined' style={{ height: 50 }} multiline onChangeText={(txt) => { setInfo(s => { return { ...s, note: txt } }) }} />



                        <View style={{ flexDirection: "row", gap: 7, flexWrap: 'wrap', justifyContent: "flex-start", alignItems: 'center', marginTop: 20 }}>
                            {
                                [
                                    'Change of Mind',
                                    'Wait Time',
                                    'Miscommunication',
                                    'Dietary Restrictions',

                                    'Quality or Accuracy Concerns',

                                    'Other'
                                ].map((e) => {
                                    return (
                                        <TouchableHighlight underlayColor onPress={() => setInfo(s => { return { ...s, reason: e } })}>
                                            <Text style={{ borderWidth: 1, borderColor: 'black', padding: 5, borderRadius: 5, color: info.reason == e ? "white" : 'black', fontSize: 18, backgroundColor: info.reason == e ? colors.primary : 'white' }}>{e}</Text>
                                        </TouchableHighlight>
                                    )
                                })
                            }

                        </View>



                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 10, gap: 20 }}>
                            <View style={{ flexDirection: 'row', gap: 5, }}>
                                <Text style={{ fontSize: 20, color: 'black', height: 50, textAlignVertical: 'center', marginRight: 15 }}>Introduisez votre code</Text>
                                <TextInput style={{ width: 100, minHeight: 50, maxHeight: 50 }} mode='outlined' secureTextEntry keyboardType="number-pad" onChangeText={(txt) => setInfo(s => { return { ...s, pin: txt } })} />
                            </View>


                            <TouchableHighlight onPress={() => {
                                dispatch({ type: 'HIDE_PREMISSION_CANCEL', payload: false })
                            }}>
                                <View style={{ backgroundColor: 'red', padding: 15, paddingHorizontal: 30, borderRadius: 5 }}>
                                    <Text style={{ color: 'white' }}>CANCEL</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight onPress={() => {
                                if (info.pin.length > 0 && stuff.some((e) => e.pin == info.pin && e.role == 'ROLE_DIRECTOR')) {
                                    dispatch(cancelProductInOrder(modal?._id))
                                    dispatch(reSendAllToKitchen({ orderNumber: modal?.orderNumber }))
                                    dispatch({ type: 'HIDE_PREMISSION_CANCEL', payload: true })
                                } else {
                                    alert('PIN incorrect')
                                }
                            }}>
                                <View style={{ backgroundColor: colors.primary, padding: 15, paddingHorizontal: 30, borderRadius: 5 }}>
                                    <Text style={{ color: 'white' }}>CONFIRM</Text>
                                </View>
                            </TouchableHighlight>

                            {/* <Button text='Confirm' onPress={() => {
                            alert(info.pin)
                            // if (info.pin == '123456')
                            //     dispatch({ type: 'HIDE_PREMISSION_CANCEL' })
                            // else
                            //     alert('PIN INCORRECT')
                        }} />
                        <Button text='Cancel' onPress={() => { dispatch({ type: 'HIDE_PREMISSION_CANCEL' }) }} /> */}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    )
}

export {
    ModalCancelPremission
}
