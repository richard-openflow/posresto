import React, { useEffect, useState } from 'react'
import { Modal, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { TextInput } from 'react-native-paper'
import { addNoteToOrder } from '../redux/actions/orderActions'
const ModalNoteToKitchen = ({ orderNumber, currentNote }) => {
    const { showNoteKitchen } = useSelector(state => state.Modal)
    const dispatch = useDispatch()
    const [note, setNote] = useState(currentNote)

    useEffect(() => {
        setNote(currentNote)
    }, [currentNote])
    return (
        <Modal statusBarTranslucent transparent visible={showNoteKitchen}>
            <View style={{ flex: 1, backgroundColor: '#00000045', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ minHeight: 150, minWidth: 300, backgroundColor: 'white' }}>
                    <View style={{ flexDirection: 'row-reverse' }}>
                        <TouchableHighlight underlayColor onPress={() => { dispatch({ type: 'HIDE_NOTE_KITCHEN' }) }}>
                            <EvilIcons name={'close'} size={30} color={'red'} />
                        </TouchableHighlight>
                    </View>
                    <View style={{ padding: 5 }}>
                        <TextInput value={note} onChangeText={(txt) => setNote(txt)} multiline contentStyle={{ height: 100 }} placeholder='Note' label={'Note'} mode='outlined' />
                        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10, gap: 5 }}>
                            <TouchableHighlight underlayColor style={{ borderRadius: 5 }} onPress={() => {
                                dispatch({ type: 'HIDE_NOTE_KITCHEN', payload: { note: note + '', orderNumber } })
                                dispatch(addNoteToOrder({ note, orderNumber }))
                            }}>
                                <View style={[{ width: 80, height: 30, justifyContent: "center", alignItems: "center", borderWidth: StyleSheet.hairlineWidth, borderColor: "black" }, { backgroundColor: 'white', borderRadius: 3 }]}>
                                    <Text style={{ color: 'black' }}>Ok</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </View>
        </Modal >
    )
}
export {
    ModalNoteToKitchen
}