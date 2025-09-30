import React, { useRef } from 'react';
import { Dimensions, SectionList, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
// import { useQuery } from '../utils/realmDB/store';

import AsyncStorage from '@react-native-async-storage/async-storage';
import 'moment/locale/fr';
import Snackbar from 'react-native-snackbar';
import Swipeable from 'react-native-swipeable';
import Feather from "react-native-vector-icons/Feather";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from 'react-redux';
import { changeOrderClassifyingProduct, payOrder, reSendAllToKitchen, updateOrder } from '../redux/actions/orderActions';
import { CommandController } from '../utils/realmDB/service/commandService';
import ProductListItem from './ProductListItem';

const { height } = Dimensions.get("screen")

const SelectedProducts = ({ setShowTransfer, indexes, setIndexes, setShowPrinter, activeStuff, expand, currentService, orderNumber, onDelete = () => { }, setStateSendToKitchen = () => { }, setValue, getValues, ownership, onItemEditPress, nextSerivce = () => { }, dispearTheButton = false, setFormule, formule }) => {

    const { orders } = useSelector(state => state.order)
    const dispatch = useDispatch()
    const ref = useRef()
    const order = orders?.find(a => a?.orderNumber == orderNumber)



    if (order?.commandProduct?.length === 0) {
        return null;
    }
    const sendToKitchen = (p, type = 'sent', value = 1) => {

        dispatch(updateOrder({ p, orderNumber, type, value }))
    }

    let data = order?.commandProduct

        ?.reduce((aa, b) => {

            let a = aa
            let index = a.findIndex(aa => aa.title == 'service ' + parseInt(b?.orderClassifying))

            if (index >= 0 && !b?.product?.isFormula) {
                const ci = a[index].data.findIndex(i => i?.product?._id == b?.product?._id && i?.status == b?.status && b?.product?.option?.filter(a => a?.required).length == 0 && i?.product?.status != "cancel" && b?.sent >= b?.orderClassifying && expand)
                if (ci >= 0)
                    a[index].data[ci].number += 1
                else {
                    a[index].data = [...(a[index].data || []), { ...b, number: 1 }]
                }
            } else {
                if (!b?.product?.isFormula)
                    a = [...a, { title: 'service ' + b?.orderClassifying, data: [{ ...b, number: 1 }] }]
                else
                    a = [{ title: 'Formulas', data: [{ ...b, number: 1 }] }, ...a]
            }
            return a
        }, [])

    return (
        <View style={{ width: '100%', maxHeight: height - 200, height: height - 250 }}>
            <SectionList
                legacyImplementation={true}
                sections={data?.sort((a, b) => {
                    return parseInt(a?.title?.slice(8)) > parseInt(b?.title?.slice(8))
                }) || []}

                ref={ref}
                ItemSeparatorComponent={() => <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: '#ccc' }} />}
                renderSectionHeader={({ section }) => {
                    if (section?.title == 'Formulas') {
                        return null
                    }
                    return (
                        <>
                            {-section?.title?.slice(8) == parseInt(currentService) &&
                                <TouchableHighlight disabled style={{ flexGrow: 1, marginTop: 1 }} onPress={() => {
                                    nextSerivce(parseInt(section?.title?.slice(8)), true)
                                }}>
                                    <View style={{ backgroundColor: 'red', padding: 3, }}>
                                        <Text style={{ color: 'white', textAlign: 'right' }}>New service</Text>
                                    </View>
                                </TouchableHighlight>}
                            <View style={{ flexDirection: 'row' }}>
                                {-section?.title?.slice(8) != parseInt(currentService) && <TouchableHighlight onPress={() => {

                                    nextSerivce(parseInt(section?.title?.slice(8)), false, true)
                                }}>
                                    <View style={{ backgroundColor: 'gray', padding: 3, }}>
                                        <Text style={{ color: 'white', textAlign: 'right' }}>Insert service</Text>
                                    </View>
                                </TouchableHighlight>}
                                <TouchableHighlight style={{ flexGrow: 1 }} onPress={() => {
                                    nextSerivce(parseInt(section?.title?.slice(8)), true)
                                }}>
                                    <View style={{ backgroundColor: section?.title == 'service ' + currentService ? 'red' : 'black', padding: 3, }}>
                                        <Text style={{ color: 'white', textAlign: 'right' }}>{section.title}</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>

                        </>
                    )
                }}
                onContentSizeChange={() => {
                    try {
                        if (data?.length > 0)
                            setTimeout(() => {
                                ref?.current?.scrollToLocation({
                                    animated: true,
                                    sectionIndex: data?.length - 1,
                                    itemIndex: data[data?.length - 1]?.data?.length - 1,
                                })
                            }, 0);
                    } catch (error) {

                    }
                }}

                onScrollToIndexFailed={(error) => {
                    console.log({ error })
                }}
                keyExtractor={(item, index) => {

                    return index
                }}
                renderItem={({ item: selectedProduct, index }) => {

                    let PaidProduct = order?.paidHistory?.some(a => {

                        return a?.products?.some(c => c == selectedProduct?._id) && !a?.cancelled && a?.amount > 0
                    })
                    const rightButtons = [

                        // <View style={{ flexDirection: 'row', borderLeftWidth: 1, borderLeftColor: "#00000010", marginLeft: 10 }}>
                        <>
                            {selectedProduct?.sent >= selectedProduct?.orderClassifying && selectedProduct?.status != 'cancel'
                                &&
                                <TouchableHighlight
                                    style={{
                                        width: 35, height: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 45, margin: 5, backgroundColor: PaidProduct ? "gray" : 'red'
                                    }}
                                    underlayColor
                                    disabled={PaidProduct}
                                    onPress={() => {
                                        AsyncStorage.getItem('kitchenDisplay').then((e) => {

                                            if (e == 'false') {
                                                CommandController.cancelCommnadItem(selectedProduct?._id)
                                                dispatch(reSendAllToKitchen({ orderNumber: orderNumber }))
                                            }
                                            else {
                                                if (selectedProduct?.status == 'new')
                                                    dispatch({ type: 'SHOW_PREMISSION_CANCEL', payload: { _id: selectedProduct?._id, orderNumber } })
                                                else
                                                    CommandController.cancelCommnadItem(selectedProduct?._id)
                                            }
                                        })
                                    }}>
                                    <Feather size={25} color={'white'} name={'x'} />
                                </TouchableHighlight>}
                            {(selectedProduct?.sent < selectedProduct?.orderClassifying) &&

                                <TouchableHighlight
                                    style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 45, margin: 5, backgroundColor: 'red' }}
                                    underlayColor
                                    onPress={() => {
                                        setTimeout(() => {
                                            sendToKitchen(selectedProduct, 'delete')
                                        }, 100);

                                    }}>
                                    <Ionicons size={25} color={'white'} name={'trash-sharp'} />
                                </TouchableHighlight>}
                        </>
                        ,

                        <TouchableHighlight
                            disabled={PaidProduct}
                            style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 45, margin: 5, backgroundColor: PaidProduct ? "gray" : 'blue' }}

                            onPress={() => {
                                setShowTransfer(true)
                                setTimeout(() => {
                                    setIndexes([index])
                                    setShowPrinter(true)
                                }, 200);
                            }}>
                            <FontAwesome5 size={25} color={'white'} name={'share'} />
                        </TouchableHighlight>,

                        <TouchableHighlight
                            style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 45, margin: 5, backgroundColor: PaidProduct ? "gray" : 'limegreen' }}
                            disabled={PaidProduct}
                            onPress={() => {
                                dispatch(payOrder({
                                    orderNumber,
                                    _id: new Realm.BSON.ObjectID(),
                                    payType: "offert",
                                    amount: selectedProduct?.product?.price,
                                    roomNumber: "",
                                    firstName: "",
                                    lastName: "",
                                    phone: "",
                                    email: "",
                                    products: [selectedProduct?._id],
                                    offertBy: activeStuff?.lastName + " " + activeStuff?.firstName
                                }, () => {

                                    Snackbar.show({
                                        text: 'Payed',
                                        duration: Snackbar.LENGTH_SHORT,
                                    })
                                }))

                            }}>
                            <Ionicons size={25} color={"white"} name={'gift-sharp'} />
                        </TouchableHighlight>
                        // </View>

                    ];
                    const leftButtons = [
                        <TouchableHighlight
                            style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 45, margin: 5, backgroundColor: 'limegreen' }}

                            onPress={() => {
                                dispatch(changeOrderClassifyingProduct({
                                    _id: selectedProduct?._id,
                                    orderClassifying: selectedProduct?.orderClassifying - 1
                                }))
                            }}>
                            <Feather size={25} color={"white"} name={'arrow-up'} />
                        </TouchableHighlight>,
                        <TouchableHighlight
                            style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 45, margin: 5, backgroundColor: 'red' }}

                            onPress={() => {
                                dispatch(changeOrderClassifyingProduct({
                                    _id: selectedProduct?._id,
                                    orderClassifying: selectedProduct?.orderClassifying + 1
                                }))
                            }}>
                            <Feather size={25} color={"white"} name={'arrow-down'} />
                        </TouchableHighlight>
                    ]

                    return (
                        <Swipeable
                            key={selectedProduct?._id}
                            leftButtons={index == 0 ? leftButtons[1] : leftButtons}
                            leftButtonContainerStyle={{ flexDirection: 'row-reverse' }}
                            rightButtons={selectedProduct?.sent >= selectedProduct?.orderClassifying && selectedProduct?.status != 'cancel' ? rightButtons : [rightButtons[0]]}>
                            <ProductListItem
                                formule={formule}
                                setFormule={setFormule}
                                onItemEditPress={onItemEditPress}
                                ownership={ownership}
                                orderNumber={orderNumber}
                                setValue={setValue}
                                getValues={getValues}
                                order={orders}
                                nextInKitchen={orders?.nextInKitchen}
                                setStateSendToKitchen={setStateSendToKitchen}
                                onDelete={() => onDelete(selectedProduct)}
                                type={orders?.type}
                                sendToKitchen={sendToKitchen}
                                selectedProduct={selectedProduct}
                                index={index} />
                        </Swipeable>
                    )
                }}
                extraData={order?.commandProduct}

                ListHeaderComponent={() => {
                    if (order?.bookingId && (order?.firstName || order?.lastName))
                        return (
                            <View style={{ margin: 8, gap: 3 }}>
                                <Text style={{ textAlign: 'center', color: 'black', fontSize: 16 }}>{order?.firstName} {order?.lastName}</Text>
                            </View>
                        )
                }}
                ListFooterComponent={() => {
                    if (!orderNumber) return null
                    if (!dispearTheButton) return <View style={{ backgroundColor: 'red', padding: 3, }}><Text style={{ color: 'white', textAlign: 'right' }}>service {currentService}</Text></View>
                    return (
                        <View style={{ borderTopColor: 'black', }}>
                            <TouchableHighlight onPress={() => {
                                nextSerivce(data?.filter(a => a?.title !== 'Formulas')?.length + 1)
                            }}>
                                <View style={{ backgroundColor: 'black', padding: 3, }}>
                                    <Text style={{ color: 'white', textAlign: 'right' }}>+ Add service</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    )
                }}
            />
        </View >
    )

};


export default SelectedProducts