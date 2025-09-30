import { FlashList } from '@shopify/flash-list'
import React, { useState } from 'react'
import { FlatList, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { Checkbox, RadioButton } from 'react-native-paper'
import Feather from 'react-native-vector-icons/Feather'
const size = 35
const OptionItem = ({ item, ChooseOptions, setChooseOptions }) => {

    return (
        <View >
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: 'black', fontSize: 14, fontWeight: '700', marginTop: 15 }}>{item?.title}</Text>
                {item?.required &&
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                        <Text style={{ color: 'white', fontSize: 12, marginLeft: 15, backgroundColor: 'red', paddingHorizontal: 10, borderRadius: 10, marginTop: 5 }}>Required</Text>
                    </View>
                }
            </View>
            <View style={{ paddingLeft: 15 }}>
                {
                    item?.type == 'conditions' &&

                    <FlashList
                        data={item.conditionOptions}
                        estimatedItemSize={2}
                        extraData={JSON.parse(JSON.stringify(ChooseOptions))}
                        renderItem={({ item: a }) => {
                            console.log(JSON.stringify(item, '', '\t'))
                            return (
                                <TouchableHighlight underlayColor onPress={() => {
                                    setChooseOptions(p => {
                                        let prev = p
                                        let f = prev.conditionsChoose.findIndex((e) => e.condition == item?._id)
                                        if (f < 0) {
                                            prev.conditionsChoose = [...prev.conditionsChoose, {
                                                condition: item?._id,
                                                title: item?.title,
                                                options: [
                                                    a
                                                ],
                                                required: item?.required
                                            }]

                                        } else {
                                            if (!item?.isMultiple)
                                                prev.conditionsChoose[f].options = [a]
                                            else {
                                                if (prev.conditionsChoose[f].options.some(c => c == a))
                                                    prev.conditionsChoose[f].options = prev.conditionsChoose[f].options.filter(c => c != a)
                                                else
                                                    prev.conditionsChoose[f].options = [...prev.conditionsChoose[f].options, a]
                                            }
                                        }
                                        return JSON.parse(JSON.stringify(prev))
                                    })

                                }} >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        {!item?.isMultiple
                                            &&
                                            < RadioButton onPress={() => {
                                                setChooseOptions(p => {
                                                    let prev = p
                                                    let f = prev.conditionsChoose.findIndex((e) => e.condition == item?._id)
                                                    if (f < 0) {
                                                        prev.conditionsChoose = [...prev.conditionsChoose, {
                                                            condition: item?._id,
                                                            title: item?.title,
                                                            options: [
                                                                a
                                                            ],
                                                            required: item?.required
                                                        }]

                                                    } else {
                                                        prev.conditionsChoose[f].options = [a]
                                                    }
                                                    return JSON.parse(JSON.stringify(prev))
                                                })
                                            }} status={ChooseOptions?.conditionsChoose?.find(i => i.condition == item?._id)?.options.some(b => b == a) ? 'checked' : 'unchecked'} />
                                        }

                                        {item?.isMultiple
                                            &&
                                            < Checkbox onPress={() => {
                                                setChooseOptions(p => {
                                                    let prev = p
                                                    let f = prev.conditionsChoose.findIndex((e) => e.condition == item?._id)
                                                    if (f < 0) {
                                                        prev.conditionsChoose = [...prev.conditionsChoose, {
                                                            condition: item?._id,
                                                            title: item?.title,
                                                            options: [
                                                                a
                                                            ],
                                                            required: item?.required
                                                        }]


                                                    } else {
                                                        if (prev.conditionsChoose[f].options.some(c => c == a))
                                                            prev.conditionsChoose[f].options = prev.conditionsChoose[f].options.filter(c => c != a)
                                                        else
                                                            prev.conditionsChoose[f].options = [...prev.conditionsChoose[f].options, a]
                                                    }
                                                    return JSON.parse(JSON.stringify(prev))
                                                })
                                            }} status={ChooseOptions?.conditionsChoose?.find(i => i.condition == item?._id)?.options.some(b => b == a) ? 'checked' : 'unchecked'} />
                                        }
                                        <Text style={{ color: 'black' }}>{a}</Text>
                                    </View>
                                </TouchableHighlight>)
                        }}
                    />
                }
                {item?.type == 'addableIngredients' &&

                    <FlashList
                        data={item.ingredientsOptions}
                        estimatedItemSize={1}
                        extraData={JSON.parse(JSON.stringify(ChooseOptions))}
                        renderItem={({ item: a }) => {
                            const AddOrRemoveIngredient = (a, addOrDel = 'add') => {

                                setChooseOptions(p => {
                                    let prev = p
                                    let f = prev.addableIngredientsChoose.findIndex((e) => e.addableIngredient == item?._id)
                                    if (f < 0) {
                                        prev.addableIngredientsChoose = [...prev.addableIngredientsChoose, {
                                            addableIngredient: item?._id,
                                            title: item?.title,
                                            options: [{
                                                ingredient: a,
                                                price: a.addablePrice,
                                                quantity: 1
                                            }

                                            ],
                                            required: item?.required
                                        }]

                                    } else {

                                        let options = prev.addableIngredientsChoose[f].options
                                        let ing = -1
                                        if (addOrDel == 'add') {
                                            ing = options.findIndex((c) => c.ingredient._id == a._id)
                                            if (ing >= 0)
                                                options[ing].quantity += 1
                                            else {
                                                options = [...options, {
                                                    ingredient: a,
                                                    price: a.addablePrice,
                                                    quantity: 1
                                                }]
                                            }
                                        } else if (addOrDel == 'remove') {
                                            ing = options.findIndex((c) => c.ingredient._id == a._id)
                                            if (ing >= 0 && options[ing].quantity > 0)
                                                options[ing].quantity -= 1

                                        }
                                        prev.addableIngredientsChoose[f].options = options?.filter(a => a.quantity > 0)
                                        prev.addableIngredientsChoose = prev?.addableIngredientsChoose?.filter(a => a?.options?.length > 0)
                                    }

                                    return JSON.parse(JSON.stringify(prev))
                                })

                            }
                            return (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                    <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                                        <TouchableHighlight onPress={() => {
                                            AddOrRemoveIngredient(a, 'remove')
                                        }}>
                                            <View style={{ width: size, height: size, backgroundColor: 'white', borderColor: 'black', borderWidth: StyleSheet.hairlineWidth, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                                                <Feather color={'black'} name={'minus'} />
                                            </View>
                                        </TouchableHighlight>
                                        <Text style={{ color: 'black', marginHorizontal: 2, fontSize: 18, minWidth: 35, textAlign: 'center' }}>{ChooseOptions?.addableIngredientsChoose?.find(i => i.addableIngredient == item?._id)?.options.find(b => b?.ingredient?._id == a._id)?.quantity || 0}</Text>
                                        <TouchableHighlight
                                            onPress={() => {
                                                AddOrRemoveIngredient(a, 'add')
                                            }}>
                                            <View style={{ width: size, height: size, backgroundColor: 'white', borderColor: 'black', borderWidth: StyleSheet.hairlineWidth, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                                                <Feather color={'black'} name={'plus'} />
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                    <Text style={{ color: 'black', marginLeft: 7 }}>{a.ingredientName}</Text>
                                    <View style={{ flexGrow: 1 }} />
                                    <Text style={{ color: 'black' }}>+ {a.addablePrice}</Text>
                                </View>
                            )
                        }}
                    />
                }
                {item?.type == 'addableProducts' &&

                    <FlashList
                        data={item.productOptions}
                        estimatedItemSize={1}
                        extraData={JSON.parse(JSON.stringify(ChooseOptions))}
                        renderItem={({ item: a }) => {
                            console.log(JSON.stringify(a,))
                            const AddOrRemoveProduct = (a, addOrDel = 'add') => {

                                setChooseOptions(p => {
                                    let prev = p
                                    let f = prev.addableProductsChoose.findIndex((e) => e.addableProduct == item?._id)
                                    if (f < 0) {
                                        prev.addableProductsChoose = [...prev.addableProductsChoose, {
                                            addableProduct: item?._id,
                                            title: item?.title,
                                            options: [{
                                                item: a,
                                                price: a.addablePrice,
                                                quantity: 1,
                                                product: a?.product?._id
                                            }],
                                            required: item?.required
                                        }]

                                    } else {

                                        let options = prev.addableProductsChoose[f].options
                                        let ing = -1
                                        if (addOrDel == 'add') {
                                            ing = options.findIndex((c) => c.product == a?.product?._id)
                                            if (ing >= 0)
                                                options[ing].quantity += 1
                                            else {
                                                options = [...options, {
                                                    item: a,
                                                    product: a?.product?._id,
                                                    price: a.addablePrice,
                                                    quantity: 1
                                                }]
                                            }
                                        } else if (addOrDel == 'remove') {
                                            ing = options.findIndex((c) => c.product == a?.product?._id)
                                            if (ing >= 0 && options[ing].quantity > 0)
                                                options[ing].quantity -= 1

                                        }
                                        prev.addableProductsChoose[f].options = options?.filter(a => a.quantity > 0)
                                        prev.addableProductsChoose = prev?.addableProductsChoose?.filter(a => a?.options?.length > 0)
                                    }

                                    return JSON.parse(JSON.stringify(prev))
                                })

                            }
                            console.log('a==>', JSON.stringify({ a }, '', '\t'))
                            return (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                    <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                                        <TouchableHighlight onPress={() => {
                                            AddOrRemoveProduct(a, 'remove')
                                        }}>
                                            <View style={{ width: size, height: size, backgroundColor: 'white', borderColor: 'black', borderWidth: StyleSheet.hairlineWidth, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                                                <Feather color={'black'} name={'minus'} />
                                            </View>
                                        </TouchableHighlight>
                                        <Text style={{ color: 'black', marginHorizontal: 2, fontSize: 18, minWidth: 35, textAlign: 'center' }}>{ChooseOptions?.addableProductsChoose?.find(i => i.addableProduct == item?._id)?.options.find(b => b?.product + '' == '' + a?.product?._id)?.quantity || 0}</Text>
                                        <TouchableHighlight
                                            onPress={() => {
                                                AddOrRemoveProduct(a, 'add')
                                            }}>
                                            <View style={{ width: size, height: size, backgroundColor: 'white', borderColor: 'black', borderWidth: StyleSheet.hairlineWidth, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                                                <Feather color={'black'} name={'plus'} />
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                    <Text style={{ color: 'black', marginLeft: 7 }}>{a?.product?.itemName}</Text>
                                    <View style={{ flexGrow: 1 }} />
                                    <Text style={{ color: 'black' }}>+ {a.addablePrice}</Text>
                                </View>
                            )
                        }}
                    />
                }



                {item?.type == 'removableIngredients' &&
                    <FlashList
                        data={item.ingredientsOptions}
                        estimatedItemSize={2}
                        extraData={JSON.parse(JSON.stringify(ChooseOptions))}
                        renderItem={({ item: a }) => {

                            return (
                                <TouchableHighlight underlayColor onPress={() => {
                                    setChooseOptions(p => {
                                        let prev = p
                                        let f = prev.removableIngredientsChoose.findIndex((e) => e.removableIngredient == item?._id)
                                        if (f < 0) {
                                            prev.removableIngredientsChoose = [...prev.removableIngredientsChoose, {
                                                removableIngredient: item?._id,
                                                title: item?.title,
                                                options: [
                                                    a?._id
                                                ],

                                                required: item?.required
                                            }]

                                        } else {
                                            if (!prev.removableIngredientsChoose[f].options.some(n => a?._id == n))
                                                prev.removableIngredientsChoose[f].options = [...prev.removableIngredientsChoose[f].options, a?._id]
                                            else
                                                prev.removableIngredientsChoose[f].options = prev.removableIngredientsChoose[f].options?.filter(n => n != a?._id)
                                        }
                                        prev.removableIngredientsChoose = prev?.removableIngredientsChoose?.filter(a => a?.options?.length > 0)
                                        return JSON.parse(JSON.stringify(prev))
                                    })

                                }} >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Checkbox
                                            status={ChooseOptions?.removableIngredientsChoose?.find(i => i.removableIngredient == item?._id)?.options.some(b => b == a?._id) ? 'checked' : 'unchecked'}
                                        />
                                        <Text style={{ color: 'black' }}>{a.ingredientName}</Text>
                                    </View>
                                </TouchableHighlight>)
                        }}
                    />

                }
            </View>
        </View>
    )
}

export { OptionItem }

const styles = StyleSheet.create({})