import { FlatList, Modal, StyleSheet, Text, View, TouchableHighlight, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Checkbox } from 'react-native-paper'
import { colors } from '../theme/Styles'
import ThermalPrinterModule from 'react-native-thermal-printer';
import { getOrderObject, getPayload } from '../utils/helpers';
import { useSelector } from 'react-redux';
import { CommandController } from '../utils/realmDB/service/commandService';
import moment from 'moment';
import { transferProductToOrder } from '../redux/actions/orderActions';
import { BSON } from 'realm';
let timer = null
const SelectItemToPrint = ({ setShowTransfer, showTransfer = false, indexes, setIndexes, printer, orders, orderNumber, showPrinter, setShowPrinter, pointOfSale, user, Zone, table, Command, dispatch, selectOrder = orders?.find((e) => e?.orderNumber == orderNumber), }) => {

    const [transfer, setTransfer] = useState(false)
    const [order, setOrders] = useState([]);
    const [zones, setZones] = useState([]);
    const [cmd, setCmd] = useState(Command);
    const [o, setO] = useState(orderNumber);
    const [u, setU] = useState(null);
    const [facture, setFacture] = useState(false);


    const { activeStuff } = useSelector(state => state.stuff)


    useEffect(() => {
        setZones(Zone);
    }, [table]);

    useEffect(() => {
        setTransfer(showTransfer);
    }, [showTransfer]);

    useEffect(() => {
        if (showPrinter) {
            CommandController.getUnPaidCommmand({
                orders,
                pointOfSaleId: pointOfSale?._id,
                dt: moment().format('YYYY/MM/DD'),
            })?.then(e => {
                setOrders(e);
            });
            setCmd(e => {
                return { ...e, zone: zones?.filter((e) => activeStuff?.role == 'ROLE_DIRECTOR' || activeStuff?.accessibleZone?.some((a) => a == e?.nameSlug))[0], unit: null };
            });
        } else {
            setIndexes([])

        }
    }, [showPrinter]);
    return (
        <Modal visible={showPrinter} transparent statusBarTranslucent>
            <View style={{ flex: 1, justifyContent: "center", alignItems: 'center', backgroundColor: '#00000044' }}>
                <View style={{ width: 450, height: '80%', backgroundColor: 'white', padding: 15 }}>
                    <Text style={{ fontSize: 26, paddingBottom: 15 }}>{!transfer ? 'Products by tickets' : 'Select Table'}</Text>

                    {!transfer &&
                        <View style={{ height: 45, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ width: '80%', color: 'black', fontWeight: '400' }}>All</Text>

                            <Checkbox onPress={() => {
                                if (orders?.
                                    find((e) => e?.orderNumber == orderNumber)?.commandProduct?.map((e, index) => {
                                        if (!(e?.sent < e?.orderClassifying))
                                            return index
                                    }).every((e) => indexes.some(f => f == e)))
                                    setIndexes([])
                                else
                                    setIndexes(orders?.
                                        find((e) => e?.orderNumber == orderNumber)?.commandProduct?.map((e, index) => {
                                            if (!(e?.sent < e?.orderClassifying))
                                                return index

                                        }))

                            }} status={
                                orders?.
                                    find((e) => e?.orderNumber == orderNumber)?.commandProduct?.map((e, index) => {
                                        if (!(e?.sent < e?.orderClassifying))
                                            return index
                                    }).every((e) => indexes.some(f => f == e))
                                    ? 'checked' : 'unchecked'} />
                        </View>}
                    {!transfer &&
                        <>
                            <FlatList
                                data={orders?.
                                    find((e) => e?.orderNumber == orderNumber)?.commandProduct || []}
                                ItemSeparatorComponent={<View style={{ height: 5 }} />}
                                renderItem={({ item, index }) => {

                                    return (
                                        <View style={{ height: 45, flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{ color: 'black', marginRight: 10 }}>{item?.product?.price}</Text>
                                            <Text style={{ color: 'black', flexGrow: 1, fontWeight: '400' }}>- {item?.product?.itemName}</Text>

                                            <Checkbox disabled={(item?.sent < item?.orderClassifying)} onPress={() => {

                                                if (!indexes.some(e => e == index)) {
                                                    setIndexes(f => { return [...f, index] })
                                                } else {
                                                    setIndexes((e) => e?.filter(f => f != index))

                                                }
                                            }} status={(indexes?.some((a) => a == index)) ? 'checked' : 'unchecked'} />

                                        </View>
                                    )
                                }}
                            />

                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', padding: 7 }}>
                                <TouchableHighlight onPress={() => setFacture(a => !a)} style={{ flexDirection: 'row', alignItems: 'center', }}>
                                    <>
                                        <Checkbox status={facture ? 'checked' : 'unchecked'} />
                                        <Text>Facture</Text>
                                    </>
                                </TouchableHighlight>

                            </View>


                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 5 }}>
                                <TouchableHighlight disabled={selectOrder?.paidHistory?.length > 0} onPress={() => {

                                    setTransfer(true)
                                }}>
                                    <View style={{ padding: 20, paddingVertical: 15, width: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: selectOrder?.paidHistory?.length > 0 ? "gray" : colors.primary, borderRadius: 5 }}>
                                        <Text style={{ color: 'white' }}>Transfer</Text>
                                    </View>
                                </TouchableHighlight>
                                <View style={{ flexGrow: 1 }} />
                                <TouchableHighlight onPress={() => {
                                    if (showTransfer) {
                                        setShowTransfer(false)
                                    }
                                    setShowPrinter(false)
                                    setIndexes([])

                                }}>
                                    <View style={{ padding: 20, paddingVertical: 15, width: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red', borderRadius: 5 }}>
                                        <Text style={{ color: 'white' }}>Cancel</Text>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight onPress={() => {
                                    if (!(selectOrder?.commandProduct?.map((e) => e?.orderClassifying).every((f) => f <= selectOrder?.nextInKitchen))) {
                                        alert("You need to send all the products to kitchen or delete unsent product ")
                                        return
                                    }
                                    if (selectOrder?.nextInKitchen > 0) {
                                        try {
                                            printer?.map((e) => {
                                                if (!e?.main) {
                                                    return null
                                                }
                                                if (!e?.enbaled) {
                                                    return null
                                                }
                                                let payload = false
                                                try {
                                                    payload = getPayload({ pointOfSale, user, orders, orderNumber, indexes, dublicata: true, facture })
                                                } catch (error) {
                                                    alert('There was an error while the creating ticket')
                                                }
                                                if (timer) {
                                                    alert('please try again in 3 seconds')

                                                } else if (payload) {
                                                    timer = setTimeout(() => {
                                                        ThermalPrinterModule?.printTcp({
                                                            ip: e?.ipAdress,
                                                            port: e?.port,
                                                            autoCut: e?.autoCut,
                                                            openCashbox: e?.openCashbox,
                                                            printerNbrCharactersPerLine: e?.printerNbrCharactersPerLine,
                                                            payload,
                                                            timeout: 10000
                                                        }).catch((err) => {
                                                            alert(`Impossible de se connecter a l'imprimante : (${e.name})`)
                                                        })
                                                    }, 200);
                                                    setTimeout(() => {
                                                        timer = null
                                                    }, 3000);
                                                }
                                            })
                                        } catch (error) {

                                        } finally {
                                            if (showTransfer) {
                                                setShowTransfer(false)
                                            }
                                            setShowPrinter(false)

                                        }
                                    } else {
                                        alert("Order not sent to kitchen yet")
                                    }
                                }
                                }>
                                    <View style={{ padding: 20, paddingVertical: 15, width: 140, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary, borderRadius: 5 }}>
                                        <Text style={{ color: 'white' }}>{indexes?.length == 0 ? "Print All" : "Print"}</Text>
                                    </View>
                                </TouchableHighlight>

                            </View>
                        </>}

                    {transfer &&
                        <>
                            <>

                                <ScrollView horizontal style={{ maxHeight: 50 }}>
                                    <>
                                        {zones?.filter((e) => activeStuff?.role == 'ROLE_DIRECTOR' || activeStuff?.accessibleZone?.some((a) => a == e.nameSlug))?.map(ef => {

                                            return (
                                                <TouchableHighlight
                                                    underlayColor
                                                    style={{ borderRadius: 0, height: 50, marginRight: 8 }}
                                                    onPress={() => {
                                                        setCmd(e => {
                                                            return { ...e, zone: ef, unit: null };
                                                        });
                                                    }}
                                                >
                                                    <View
                                                        style={[
                                                            {
                                                                height: 50,
                                                                width: 169,
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                borderWidth: StyleSheet.hairlineWidth,
                                                                borderColor: 'black',
                                                            },
                                                            {
                                                                backgroundColor:
                                                                    ef.nameSlug == cmd?.zone?.nameSlug
                                                                        ? colors.primary
                                                                        : 'white',
                                                                borderRadius: 3,
                                                                paddingHorizontal: 10,
                                                            },
                                                        ]}
                                                    >
                                                        <Text
                                                            style={{
                                                                color:
                                                                    ef.nameSlug == cmd?.zone?.nameSlug
                                                                        ? 'white'
                                                                        : 'black',
                                                            }}
                                                        >
                                                            {ef.name}
                                                        </Text>
                                                    </View>
                                                </TouchableHighlight>
                                            );
                                        })}
                                    </>
                                </ScrollView>

                                <ScrollView style={{ maxHeight: 200 }}>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            width: '100%',
                                            flexWrap: 'wrap',
                                            gap: 5,
                                            marginTop: 20,
                                        }}
                                    >
                                        {table
                                            ?.sort((a, b) => a?.unitNumber - b?.unitNumber)
                                            ?.filter(a => a?.localization == cmd?.zone?.nameSlug)
                                            ?.map(ef => {
                                                const theBooking = orders

                                                    ?.filter((s) => {
                                                        return s.type == "onsite"
                                                    })
                                                    ?.filter((s) => {
                                                        const total = s?.commandProduct?.reduce((total, { product, clickCount, status }) => {
                                                            if (status == 'cancel')
                                                                return total
                                                            return total + product?.price * clickCount;
                                                        }, 0)

                                                        const totalPayed = s?.paidHistory?.reduce((total, { amount }) => {
                                                            return total + amount;
                                                        }, 0)

                                                        return !(totalPayed >= total)
                                                    })
                                                const hasBooking = theBooking
                                                    ?.some(
                                                        e => {
                                                            return e?.unit?._id + '' == ef?._id + ''
                                                        }
                                                    );

                                                const a = theBooking
                                                    ?.find(
                                                        e => {
                                                            return e?.unit?._id + '' == ef?._id + ''
                                                        }
                                                    )
                                                return (
                                                    <TouchableHighlight
                                                        underlayColor
                                                        style={{
                                                            borderRadius: 5,
                                                            backgroundColor: 'blue',
                                                            width: 80,
                                                            height: 50,
                                                        }}
                                                        onPress={() => {
                                                            setO(a)
                                                            setU(ef)
                                                        }}
                                                    >
                                                        <View
                                                            style={[
                                                                {
                                                                    width: 80,
                                                                    height: 50,
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                    borderWidth: StyleSheet.hairlineWidth,
                                                                    borderColor: 'black',
                                                                },
                                                                {
                                                                    backgroundColor: hasBooking
                                                                        ? 'orange'
                                                                        : ef?._id + '' == cmd?.unit?._id + ''
                                                                            ? colors.primary
                                                                            : 'white',
                                                                    borderRadius: 3,
                                                                    borderBottomColor: 'red',
                                                                    borderBottomWidth: (ef._id == u?._id) ? 5 : 0
                                                                },
                                                            ]}
                                                        >
                                                            <Text
                                                                style={{
                                                                    color:
                                                                        ef?._id + '' == cmd?.unit?._id + ''
                                                                            ? 'white'
                                                                            : 'black',
                                                                    fontSize: 20,
                                                                }}
                                                            >
                                                                {ef.unitNumber}
                                                            </Text>
                                                        </View>
                                                    </TouchableHighlight>
                                                );
                                            })}
                                    </View>
                                </ScrollView>
                            </>
                            <View style={{ flexGrow: 1 }} />
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 5 }}>

                                <View style={{ flexGrow: 1 }} />
                                <TouchableHighlight onPress={() => {
                                    if (showTransfer) {
                                        setShowTransfer(false)
                                    }
                                    setTransfer(false)
                                    setShowPrinter(false)
                                    setIndexes([])


                                }}>
                                    <View style={{ padding: 20, paddingVertical: 15, width: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red', borderRadius: 5 }}>
                                        <Text style={{ color: 'white' }}>{showTransfer ? "Cancel" : 'Previous'}</Text>
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight onPress={async () => {

                                    const newOrder = await getOrderObject({
                                        type: 'onsite',
                                        orderNumber: moment().valueOf(),
                                        nextInKitchen: selectOrder?.nextInKitchen || 0,
                                        pointOfSale,
                                        user: activeStuff,
                                        zone: { ...cmd?.zone },
                                        _id: new BSON.ObjectId(),

                                        origin: 'pos',
                                        commandProduct: [],
                                        unit: u,
                                    })


                                    dispatch(transferProductToOrder({ orderNumber, order: o, newOrder: { ...newOrder, zone: cmd?.zone }, indexes }))
                                    setShowPrinter(false)
                                    setIndexes([])
                                    setTransfer(false)
                                    setCmd(null)
                                    setO(null)
                                    setU(null)
                                    setShowTransfer(false)
                                }}>
                                    <View style={{ padding: 20, paddingVertical: 15, width: 140, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary, borderRadius: 5 }}>
                                        <Text style={{ color: 'white' }}>Confirm</Text>
                                    </View>
                                </TouchableHighlight>

                            </View>
                        </>
                    }
                </View>
            </View>
        </Modal>
    )
}


export { SelectItemToPrint }

const styles = StyleSheet.create({})