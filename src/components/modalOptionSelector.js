import React, { useEffect, useState } from 'react'
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { OptionItem } from './OptionItem'
import { AddProductToOrder } from '../redux/actions/orderActions'
import { useDispatch } from 'react-redux'
import { TextInput } from 'react-native-paper'
const { width } = Dimensions.get("screen")
const ModalOptionSelector = ({ currentService, product, linkToFormula, addablePrice, clear, orderNumber, ChooseOptions, unid, setChooseOptions, setDispearTheButton = () => { } }) => {
    const dispatch = useDispatch()

    let subtotal = ChooseOptions?.addableIngredientsChoose.reduce((t, a) => {
        let aaa = a?.options.reduce((i, j) => i + j?.price * j?.quantity, 0)
        return t + aaa
    }, 0) || 0
    let subtotalproduct = ChooseOptions?.addableProductsChoose?.reduce((t, a) => {
        let aaa = a?.options.reduce((i, j) => i + j?.price * j?.quantity, 0)
        return t + aaa
    }, 0) || 0

    return (
        <Modal statusBarTranslucent transparent visible={!!product?._id} style={{ flex: 1 }}>
            <View style={{ backgroundColor: '#00000077', flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 16, }}>
                <View style={{
                    backgroundColor: 'white', minWidth: 0.95 * width, minHeight: "95%"
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', }}>
                        <TouchableHighlight onPress={() => {
                            clear({})
                            setChooseOptions({
                                conditionsChoose: [],
                                addableIngredientsChoose: [],
                                removableIngredientsChoose: [],
                                addableProductsChoose: [],
                            })
                        }}>
                            <View style={{ width: 50, height: 50, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', }} >
                                <Text style={{ color: 'white', fontWeight: '700' }}>X</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                    <Text style={{ fontWeight: '700', color: 'black', fontSize: 35, marginLeft: 10 }}>{product?.itemName}</Text>
                    {/* <Text style={{ color: 'black' }}>{product?.desc}</Text> */}
                    <Text style={{ color: 'black', fontSize: 16, marginLeft: 10 }}>{product?.details}</Text>

                    <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: 'white', maxHeight: 550, borderRadius: 3, padding: 10, paddingHorizontal: 15, paddingRight: 5, paddingTop: 5 }}>

                        <View style={{ height: 10 }} />
                        <View style={{ flexDirection: 'row', }}>
                            <View style={{ paddingLeft: 7, minWidth: "45%" }} >
                                {
                                    product?.option?.sort((a, b) => a.index - b.index)?.map((e) => {
                                        return <OptionItem item={e} ChooseOptions={ChooseOptions} setChooseOptions={setChooseOptions}></OptionItem>
                                    })
                                }
                            </View>
                            <View style={{
                                marginLeft: 25,
                                minWidth: "45%"

                            }}>
                                <Text style={{ color: 'black', fontSize: 14, fontWeight: '700', marginTop: 15 }}>Note:</Text>
                                <TextInput
                                    value={ChooseOptions?.note}
                                    onChangeText={(txt) => {
                                        setChooseOptions(a => { return { ...a, note: txt } })
                                    }} style={{ marginTop: 15, borderWidth: 1, borderColor: 'black', padding: 5, borderRadius: 5, color: 'black', fontSize: 18, backgroundColor: 'white', minWidth: "40%" }}
                                />
                            </View>
                        </View>

                        <View style={{ height: 25 }} />
                    </ScrollView>
                    <View style={{ height: 15 }} />
                    <View style={{ flexDirection: 'row', gap: 4, paddingHorizontal: 10 }}>
                        <TouchableHighlight onPress={() => {
                            clear({})
                            setChooseOptions({
                                conditionsChoose: [],
                                addableIngredientsChoose: [],
                                removableIngredientsChoose: [],
                                addableProductsChoose: [],
                            })
                        }} style={{ marginBottom: 5, flexGrow: 1 }}>
                            <View style={{ backgroundColor: 'red', padding: 15, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: 'white' }}>Cancel</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={() => {
                            dispatch(AddProductToOrder({ product, orderNumber, ...ChooseOptions, currentService, clickCount: 1, linkToFormula, addablePrice, unid }, () => { alert('Order have been deleted') }))
                            setDispearTheButton(true)
                            clear({})
                            setChooseOptions({
                                conditionsChoose: [],
                                addableIngredientsChoose: [],
                                removableIngredientsChoose: [],
                                addableProductsChoose: [],

                            })
                        }} style={{ marginBottom: 5, flexGrow: 1 }}>
                            <View style={{ backgroundColor: 'black', padding: 15, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: 'white' }}>ADD ({linkToFormula ? addablePrice : (product?.price + subtotal + subtotalproduct)}) </Text>
                            </View>
                        </TouchableHighlight>
                    </View>

                </View>
            </View>
        </Modal>
    )
}

export { ModalOptionSelector }

const styles = StyleSheet.create({})