import React from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/Styles';
import { CommandController } from '../utils/realmDB/service/commandService';

import AsyncStorage from '@react-native-async-storage/async-storage';
import 'moment/locale/fr';
import { useDispatch } from 'react-redux';
import { reSendAllToKitchen } from '../redux/actions/orderActions';


const ProductListItem = ({ onItemEditPress, selectedProduct, index, sendToKitchen, orderNumber, setFormule }) => {

    const dispatch = useDispatch()

    return (
        <TouchableHighlight underlayColor
            disabled={(selectedProduct?.sent >= selectedProduct?.orderClassifying && selectedProduct?.status == 'new')}
            onPress={() => {
                if (selectedProduct?.product?.isFormula) {
                    setFormule({ show: true, product: selectedProduct?.product, unid: selectedProduct?.product?.unid })
                    return
                }
                if (selectedProduct?.product?.option?.length > 0)
                    onItemEditPress(selectedProduct)
            }}>
            <View style={{ padding: 5 }}>
                <View key={index} style={{}}>

                    <View style={{ flexDirection: 'row', justifyContent: "center", gap: 4, alignItems: "flex-start" }}>
                        <View style={{ justifyContent: 'flex-start', alignItems: "center", maxWidth: 20, }}>
                            <View style={{ width: 45, height: 35, justifyContent: 'center', alignItems: 'center' }}>
                                {(selectedProduct?.sent >= selectedProduct?.orderClassifying && selectedProduct?.status == 'new') &&
                                    <>

                                        <EvilIcons color={colors.new} size={25} name={'sc-telegram'} />
                                    </>
                                }
                                {selectedProduct?.status == 'inprogress' && <MaterialCommunityIcons color={colors.inprogress} size={25} name={'toaster-oven'} />}
                                {selectedProduct?.status == 'awaiting' && <EvilIcons color={colors.awaiting} size={25} name={'bell'} />}
                                {selectedProduct?.status == 'done' && <Ionicons color={colors.done} size={25} name={'checkmark-done-circle'} />}
                                {selectedProduct?.status == 'cancel' && <EvilIcons color={colors.cancel} style={{ height: 25 }} size={25} name={'close-o'} />}
                            </View>
                        </View>

                        <View style={[styles.productName, { fontWeight: 'normal', color: "black", width: '65%', flexGrow: 1, paddingLeft: 5 }]}>
                            <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.productName, { fontWeight: 'normal', color: "black", fontSize: 17, width: '100%', height: 35, textAlignVertical: 'center' }]}>{selectedProduct?.number} X {selectedProduct?.product?.itemName}</Text>
                            <View style={{
                                marginLeft: 15,
                            }}>
                                {selectedProduct?.conditionsChoose?.map((e) => {
                                    return (
                                        <>
                                            <Text style={{ fontSize: 14, color: "black", marginVertical: 5 }}>{e.title}</Text>
                                            {e?.options?.map(a => {
                                                return (
                                                    <Text style={{ fontSize: 12, color: "black", marginLeft: 15 }}> - {a}</Text>
                                                )
                                            })}
                                        </>

                                    )
                                })}

                                {selectedProduct?.addableIngredientsChoose?.map((e) => {
                                    return (
                                        <>
                                            <Text style={{ fontSize: 14, color: "black", marginVertical: 5 }}>{e.title}</Text>
                                            {e.options.map(a => {
                                                return (
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>

                                                        <Text style={{ fontSize: 12, color: "black", marginLeft: 15 }}> {a?.quantity || 1}X {a?.ingredient?.ingredientName}</Text>
                                                        <Text style={{ fontSize: 12, color: "black", marginRight: -50 }}>+ {a?.price * (a?.quantity || 1)}</Text>
                                                    </View>
                                                )
                                            })}
                                        </>

                                    )
                                })}
                                {selectedProduct?.addableProductsChoose?.map((e) => {
                                    return (
                                        <>
                                            <Text style={{ fontSize: 14, color: "black", marginVertical: 5 }}>{e.title}</Text>
                                            {e?.options?.map(a => {

                                                return (
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>

                                                        <Text style={{ fontSize: 12, color: "black", marginLeft: 15 }}> {a?.quantity || 1} X {a?.item?.product?.itemName}</Text>
                                                        <Text style={{ fontSize: 12, color: "black", marginRight: -50 }}>+ {a?.price * (a?.quantity || 1)}</Text>
                                                    </View>
                                                )
                                            })}
                                        </>

                                    )
                                })}

                                {selectedProduct?.removableIngredientsChoose?.map((e) => {
                                    return (
                                        <>
                                            <Text style={{ fontSize: 14, color: "black", marginVertical: 5 }}>{e.title}</Text>
                                            {e.options.map(a => {
                                                let option = selectedProduct?.product?.option?.find(ee => ee?._id == e?.removableIngredient)?.ingredientsOptions
                                                return (
                                                    <Text style={{ fontSize: 12, color: "black", marginLeft: 15 }}> - {option.find(v => v._id == a)?.ingredientName}</Text>
                                                )
                                            })}
                                        </>

                                    )
                                })}
                            </View>
                        </View>
                        <Text style={{ fontSize: 16, color: "black", paddingLeft: 5, height: 35, textAlignVertical: 'center' }}>{selectedProduct?.linkToFormula ? selectedProduct?.addablePrice : selectedProduct?.product?.price}</Text>
                        {selectedProduct?.linkToFormula && <Feather style={{ position: 'absolute', left: -5, top: -5 }} name={'link'} />}
                        {(selectedProduct?.product?.option.length != 0 && !selectedProduct?.product?.isFormula) && <MaterialCommunityIcons style={{ position: 'absolute', left: -3, bottom: -3, }} size={20} color={'black'} name={'tag'} />}
                        <View style={{ width: 40, height: 35, justifyContent: 'center', alignItems: 'center', display: 'none' }}>
                            {
                                // (selectedProduct?.sent >= selectedProduct?.orderClassifying && selectedProduct?.status != 'cancel') &&
                                // <TouchableHighlight
                                //     underlayColor
                                //     style={{

                                //         overflow: "hidden",
                                //         width: 45,
                                //         height: 45,
                                //         justifyContent: 'center',
                                //         alignItems: 'center'
                                //     }}
                                //     onPress={() => {
                                //         AsyncStorage.getItem('kitchenDisplay').then((e) => {

                                //             if (e == 'false') {
                                //                 CommandController.cancelCommnadItem(selectedProduct?._id)
                                //                 dispatch(reSendAllToKitchen({ orderNumber: orderNumber }))
                                //             }
                                //             else {
                                //                 if (selectedProduct?.status == 'new')
                                //                     dispatch({ type: 'SHOW_PREMISSION_CANCEL', payload: { _id: selectedProduct?._id, orderNumber } })
                                //                 else
                                //                     CommandController.cancelCommnadItem(selectedProduct?._id)
                                //             }
                                //         })
                                //     }}>
                                //     <View style={{
                                //         backgroundColor: 'red',
                                //         width: 30,
                                //         height: 30,
                                //         borderRadius: 40,
                                //         justifyContent: 'center',
                                //         alignItems: 'center'
                                //     }}>
                                //         <Feather size={20} color={'white'} name={'x'} />
                                //     </View>
                                // </TouchableHighlight>
                            }
                            {
                                // (selectedProduct?.sent < selectedProduct?.orderClassifying) &&
                                // <TouchableHighlight
                                //     style={{ width: 45, height: 45, justifyContent: 'center', alignItems: 'center' }}
                                //     underlayColor
                                //     onPress={() => {

                                //         setTimeout(() => {
                                //             sendToKitchen(selectedProduct, 'delete')
                                //         }, 100);

                                //     }}>
                                //     <EvilIcons size={25} color={'red'} name={'trash'} />
                                // </TouchableHighlight>
                            }
                        </View>
                    </View>
                </View>
            </View >
        </TouchableHighlight>
    )
}

export default ProductListItem

const styles = StyleSheet.create({})