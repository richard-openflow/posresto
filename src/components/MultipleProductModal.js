import { Modal, StyleSheet, Text, TextInput, View, TouchableHighlight } from 'react-native'
import React, { useState } from 'react'
import { colors } from '../theme/Styles'

const MultipleProductModal = ({ show = false, setShow, onChange }) => {
    const [value, setValue] = useState(0)
    return (
        <Modal statusBarTranslucent visible={show} transparent>
            <View style={{ flex: 1, backgroundColor: '#00000077', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 5, }}>
                    <Text>Multiple Product</Text>
                    <TextInput value={value + ''} onChangeText={(txt) => setValue(parseInt(txt) || 0)} style={{ width: 250, borderWidth: StyleSheet.hairlineWidth, height: 35, }} keyboardType='number-pad' />
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15, gap: 5 }}>
                        <TouchableHighlight onPress={() => setShow(false)} style={{ width: 90, height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red', borderRadius: 5 }}>
                            <Text style={{ color: 'white' }}>Cancel</Text>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={() => {
                            onChange(value)
                            setShow(false)
                        }} style={{ width: 90, height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary, borderRadius: 5 }}>
                            <Text style={{ color: 'white' }}>OK</Text>
                        </TouchableHighlight>
                    </View>

                </View>
            </View>
        </Modal>
    )
}

export { MultipleProductModal }

const styles = StyleSheet.create({})