import { Realm } from '@realm/react';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, KeyboardAvoidingView, Modal, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import ThermalPrinterModule from 'react-native-thermal-printer';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from 'react-redux';
import { clearOrders } from '../redux/actions/orderActions';
import { CommandController } from '../utils/realmDB/service/commandService';
import { getUniqueId } from '../utils/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width, height } = Dimensions.get('window')
function calculateSumByVAT(products) {
    console.log(products)
    return products?.reduce((acc, { product, linkToFormula, addablePrice }) => {
        const vat = product?.VATSales;

        if (!acc[vat]) {
            acc[vat] = {
                VAT: vat,
                price: 0,
                item: 0,
            };

        }

        acc[vat].price += ((linkToFormula ? addablePrice : product.price) * vat) / 100;
        acc[vat].item += 1;

        return acc;
    }, {

    });
}

const sumCashBox = (c) => {
    return (c?.bank || 0) + (c?.CB || 0) + (c?.esp || 0) + (c?.check || 0) + (c?.Room || 0) + (c?.credit || 0) + (c?.Offer || 0)
}
const calculateZ = (orders) => {

    const priceTickets = orders?.reduce((t, o) => {


        return t + o?.commandProduct?.reduce((a, { product, linkToFormula, addablePrice, clickCount, status, addableProductsChoose, addableIngredientsChoose }) => {

            let subtotal = addableIngredientsChoose?.reduce((t, a) => {
                let aaa = a?.options.reduce((i, j) => i + j?.price * j?.quantity, 0)
                return t + aaa
            }, 0) || 0

            let subtotalproduct = addableProductsChoose?.reduce((t, a) => {
                let aaa = a?.options?.reduce((i, j) => i + j?.price * j?.quantity, 0)
                return t + aaa
            }, 0) || 0

            if (status == 'cancel')
                return a

            return a + ((linkToFormula ? addablePrice : product?.price) * clickCount) + subtotal + subtotalproduct;
            // if (b.status != 'cancel')
            //     return a + b.product?.price
            // return a
        }, 0)
    }, 0)
    const acomptes = orders?.reduce((t, o) => {
        if (o.paymentRequired)
            return t + o?.payAmount
        return t

    }, 0)
    const numberPeople = orders?.reduce((t, o) => {
        if (o.status != 'cancel')
            return t + o?.numberPeople
        return t

    }, 0)
    const canceledOrders = orders?.reduce((t, o) => {

        return t + o?.commandProduct?.reduce((a, b) => {
            if (b.status == 'cancel')
                return a + b.product?.price
            return a
        }, 0)

    }, 0)

    const totalIn = orders?.reduce((t, o) => {
        return t + o?.paidHistory?.reduce((a, b) => {
            if (b.payType != 'account'
            )
                return a + b?.amount
            return a
        }, 0)
    }, 0)

    const cash = orders?.reduce((t, o) => {
        const res = o?.paidHistory?.reduce((a, b) => {

            if ((b.payType + '') === 'cash') {

                return { amount: a?.amount + b?.amount, number: a?.number + 1 }
            }

            return a
        }, { amount: 0, number: 0 })
        return { amount: t?.amount + res?.amount, number: t?.number + res?.number }
    }, { amount: 0, number: 0 })

    const creditCard = orders?.reduce((t, o) => {
        const res = o?.paidHistory?.reduce((a, b) => {

            if ((b.payType + '') === 'creditCard') {
                return { amount: a?.amount + b?.amount, number: a?.number + 1 }
            }

            return a
        }, { amount: 0, number: 0 })

        return { amount: t?.amount + res?.amount, number: t?.number + res?.number }
    }, { amount: 0, number: 0 })

    const Bank = orders?.reduce((t, o) => {
        const res = o?.paidHistory?.reduce((a, b) => {

            if (b.payType == 'bank') {
                return { amount: a?.amount + b?.amount, number: a?.number + 1 }
            }
            return a
        }, { amount: 0, number: 0 })
        return { amount: t?.amount + res?.amount, number: t?.number + res?.number }
    }, { amount: 0, number: 0 })

    const check = orders?.reduce((t, o) => {
        const res = o?.paidHistory?.reduce((a, b) => {

            if (b.payType == 'wire') {
                return { amount: a?.amount + b?.amount, number: a?.number + 1 }
            }
            return a
        }, { amount: 0, number: 0 })
        return { amount: t?.amount + res?.amount, number: t?.number + res?.number }
    }, { amount: 0, number: 0 })

    const Room = orders?.reduce((t, o) => {
        const res = o?.paidHistory?.reduce((a, b) => {

            if (b.payType == 'room') {
                return { amount: a?.amount + b?.amount, number: a?.number + 1 }
            }
            return a
        }, { amount: 0, number: 0 })
        return { amount: t?.amount + res?.amount, number: t?.number + res?.number }
    }, { amount: 0, number: 0 })

    const credit = orders?.reduce((t, o) => {
        const res = o?.paidHistory?.reduce((a, b) => {

            if (b.payType == 'credit') {
                return { amount: a?.amount + b?.amount, number: a?.number + 1 }
            }
            return a
        }, { amount: 0, number: 0 })
        return { amount: t?.amount + res?.amount, number: t?.number + res?.number }
    }, { amount: 0, number: 0 })

    const Offer = orders?.reduce((t, o) => {
        const res = o?.paidHistory?.reduce((a, b) => {
            if (b.payType == 'offert') {
                return { amount: a?.amount + b?.amount, number: a?.number + 1 }
            }
            return a
        }, { amount: 0, number: 0 })
        return { amount: t?.amount + res?.amount, number: t?.number + res?.number }
    }, { amount: 0, number: 0 })

    const discount = orders?.reduce((t, o) => {
        const res = o?.paidHistory?.reduce((a, b) => {
            if (b.payType == 'remise') {
                return { amount: a?.amount + b?.amount, number: a?.number + 1 }
            }
            return a
        }, { amount: 0, number: 0 })
        return { amount: t?.amount + res?.amount, number: t?.number + res?.number }
    }, { amount: 0, number: 0 })
    const Remboursement = orders?.reduce((t, o) => {
        const res = o?.paidHistory?.reduce((a, b) => {
            if (b.payType == 'account') {
                return { amount: a?.amount + o?.payAmount - b?.amount, number: a?.number + 1 }
            }
            return a
        }, { amount: 0, number: 0 })
        return { amount: t?.amount + res?.amount, number: t?.number + res?.number }
    }, { amount: 0, number: 0 })

    const allProduct = orders?.reduce((a, b) => {
        return [...a, ...b.commandProduct/*?.filter(a => !a.linkToFormula)?.map((e) => e?.product)*/]
    }, [])
    const allHT = allProduct?.reduce((a, { product: b, linkToFormula, addablePrice }) => {
        return {
            amount: a?.amount +
                (( (1 - b?.VATSales)/100 * (linkToFormula ? addablePrice : b?.price)) / 100),
            number: a?.number + 1
        }
    }, { amount: 0, number: 0 })

    const data = {
        tickets: orders?.length,
        priceTickets: priceTickets,
        numberPeople,
        totalIn: totalIn,
        cartAvg: priceTickets / (orders?.length > 0 ? orders?.length : 1)
    }

    const chiffre_d_affair = calculateSumByVAT(allProduct)

    const ableToClose = orders?.reduce((t, o) => {
        const resr = t?.r + o?.paidHistory?.reduce((a, b) => {
            return a + b?.amount
        }, 0)

        const resi = t?.i + o?.commandProduct?.reduce((a, b) => {

            if (b.status == 'cancel')
                return a
            let subtotal = b?.addableIngredientsChoose?.reduce((t, c) => {
                let aaa = c?.options?.reduce((i, j) => i + j?.price * j?.quantity, 0)

                return t + aaa
            }, 0) || 0
            let subtotalproduct = b?.addableProductsChoose?.reduce((t, c) => {
                let aaa = c?.options?.reduce((i, j) => i + j?.price * j?.quantity, 0)
                console.error({ bbb: aaa, c })
                return t + aaa
            }, 0) || 0

            return (a + b.product?.price + subtotalproduct + subtotal)



        }, 0)
        return { r: resr, i: resi }
    }, { r: 0, i: 0 })




    return {
        priceTickets,
        numberPeople,
        canceledOrders,
        totalIn,
        cash,
        creditCard,
        Bank,
        check,
        Room,
        credit,
        Offer,
        discount,
        Remboursement,
        allHT,
        chiffre_d_affair,
        ableToClose,
        data,
        acomptes
    }
}

const RapportModalType = () => {
    const [cashInfo, setCashInfo] = useState({
        esp: 0,
        check: 0,
        CB: 0,
        credit: 0,
        room: 0,
        bank: 0
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [errorIndex, setErrorIndex] = useState([])

    const dispatch = useDispatch()
    const { showModalRapport } = useSelector(state => state?.Modal)
    const { currentRestaurant: pointOfSale, role, isMaster } = useSelector(state => state.user)
    const { activeStuff } = useSelector(state => state.stuff)
    const { boxInformation } = useSelector(state => state.BoxInformation)
    const { printer } = useSelector(state => state.printer)
    const { orders, uniqueId } = useSelector(state => state.order)
    const [z, setZ] = useState({
        priceTickets: 0,
        numberPeople: 0,
        canceledOrders: 0,
        totalIn: 0,
        cash: 0,
        creditCard: 0,
        Bank: 0,
        check: 0,
        Room: 0,
        credit: 0,
        Offer: 0,
        discount: 0,
        allHT: 0,
        chiffre_d_affair: 0,
        ableToClose: 0,
        data: {}
    })

    //const printer = useQuery('Printer')?.filtered('pointOfSale._id == $0 && enbaled == true', new Realm.BSON.ObjectID(currentRestaurant))

    const cashBox = boxInformation?.filter((e) => e?.pointOfSale._id == new Realm.BSON.ObjectID(pointOfSale?._id))//?.sorted('dateOfZ', true)



    React.useEffect(() => {
        setTimeout(() => {
            setZ(calculateZ(orders))
        }, 1);
    }, [])



    const PressXRapport = () => {

        printer?.map((e) => {
            let a = orders?.reduce((a, b) => {
                if (isMaster)
                    return [...a, ...b?.commandProduct]
                if (!isMaster && activeStuff?._id == b?.user?._id)
                    return [...a, ...b?.commandProduct]
                return a
            }, [])

            let b = a
                ?.reduce((a, b) => {

                    const g = b?.addableProductsChoose?.map((e) => e?.options?.map((f) => {
                        let obj = { ...f?.item?.product, price: f?.price }
                        return Array.from({ length: (f?.quantity || 1) }, () => ({ ...obj }));
                    }))
                        ?.reduce((t, y) => [...t, ...y], [])
                        ?.reduce((t, y) => [...t, ...y], [])
                        ?.map(k => { return { product: k } })

                    return [...a, b, ...(g || [])]


                }, [])
                ?.reduce((a, b) => {

                    const index = a?.findIndex((e) => e?.product?._id + '' == '' + b?.product?._id && b?.status == e?.status)
                    if (index >= 0) {
                        let aa = a;
                        aa[index].n += 1
                        if (b?.addableIngredientsChoose)
                            aa[index].addableIngredientsChoose = [...(aa[index].addableIngredientsChoose || []), ...(b?.addableIngredientsChoose || [])]
                        if (b?.addableProductsChoose)
                            aa[index].addableProductsChoose = [...(aa[index].addableProductsChoose || []), ...(b?.addableProductsChoose || [])]
                        return aa
                    } else {

                        return [...a, { ...b, product: b?.product, status: b?.status, n: 1, }]
                    }

                }, [])

            if (!e?.main) return null
            if (!e?.enbaled) {
                return null
            }
            setTimeout(() => {
                ThermalPrinterModule.printTcp({
                    ip: e?.ipAdress,
                    port: e?.port,
                    autoCut: e?.autoCut,
                    openCashbox: e?.openCashbox,
                    // printerDpi:5,
                    printerNbrCharactersPerLine: e?.printerNbrCharactersPerLine,
                    payload:
                        "[L]\n" +
                        "[L]\n" +
                        "[L]\n" +
                        "[L]\n" +
                        "[L]\n" +

                        "[C]<u><font size='big' color='bg-black'>Ticket Z</font></u>\n" +
                        '[L]------------------------------------------------\n' +
                        "[L]\n" +
                        `[C]<font size='wide'>${pointOfSale?.title}</font>\n` +
                        "[L]\n" +
                        '[L]------------------------------------------------\n' +
                        (!isMaster ?
                            '' :
                            "[L]\n" +
                            "[L]\n" +
                            "[C]<font size='small'>" + pointOfSale?.email + "</font>\n" +
                            "[C]<font size='small'>" + pointOfSale?.phone + "</font>\n" +
                            "[C]<font size='small'>" + moment().format('YYYY/MM/DD HH:mm') + "</font>\n" +
                            "[L]\n" +
                            "[L]\n" +
                            "[L]<u><font size='wide'>1-GENERAL </font></u>\n" +
                            "[L]\n" +
                            `[L]<font size='small'>Nombre de tickets </font>[R]<font size='small'>${z?.data?.tickets}</font> \n` +
                            `[L]<font size='small'>Nombre de personne </font>[R]<font size='small'>${z?.data?.numberPeople}</font> \n` +
                            `[L]<font size='small'>Total des tickets </font>[R]<font size='small'>${z?.data?.priceTickets}</font> \n` +
                            `[L]<font size='small'>Avg par personne </font>[R]<font size='small'>${z.data?.numberPeople > 0 ? Number(z?.data?.priceTickets / z.data?.numberPeople).toFixed(2) : 0}</font> \n` +
                            `[L]<font size='small'>Total des encaisse </font>[R]<font size='small'>${z?.data?.totalIn - ((z?.discount?.amount || 0) + (z?.Offer?.amount || 0) + (z?.credit?.amount || 0) + (z?.Remboursement?.amount || 0))}</font> \n` +

                            `[L]<font size='small'>total acomptes </font>[R]<font size='small'>${new Number(z?.acomptes).toFixed(2)}</font> \n` +
                            "[L]\n" +
                            "[L]\n" +
                            "[L]<u><font size='wide'>2-ENCAISSEMENTS </font> </u>\n" +
                            "[L]\n" +
                            `[L]<font size='small'>ESP </font>[R]<font size='small'>[R]<font size='small'>[${z?.cash?.number || '-'}]</font>[R]<font size='small'>${z?.cash?.amount || '-'}</font> \n` +
                            `[L]<font size='small'>Carte </font>[R]<font size='small'>[R]<font size='small'>[${z?.creditCard?.number || '-'}]</font>[R]<font size='small'>${z?.creditCard?.amount || '-'}</font> \n` +
                            `[L]<font size='small'>Bank </font>[R]<font size='small'>[R]<font size='small'>[${z?.Bank?.number || '-'}]</font>[R]<font size='small'>${z?.Bank?.amount || '-'}</font> \n` +
                            `[L]<font size='small'>Check </font>[R]<font size='small'>[R]<font size='small'>[${z?.check?.number || '-'}]</font>[R]<font size='small'>${z?.check?.amount || '-'}</font> \n` +
                            `[L]<font size='small'>Room </font>[R]<font size='small'>[R]<font size='small'>[${z?.Room?.number || '-'}]</font>[R]<font size='small'>${z?.Room?.amount || '-'}</font> \n` +
                            `[L]<font size='small'>Credit </font>[R]<font size='small'>[R]<font size='small'>[${z?.credit?.number || '-'}]</font>[R]<font size='small'>${z?.credit?.amount || '-'}</font> \n` +
                            `[L]<font size='small'>Offert </font>[R]<font size='small'>[R]<font size='small'>[${z?.Offer?.number || '-'}]</font>[R]<font size='small'>${z?.Offer?.amount || '-'}</font> \n` +
                            `[L]<font size='small'>discount </font>[R]<font size='small'>[R]<font size='small'>[${z?.discount?.number || '-'}]</font>[R]<font size='small'>${z?.discount?.amount || '-'}</font> \n` +
                            `[L]<font size='small'>Remboursement </font>[L]<font size='small'>[R]<font size='small'>[${z?.Remboursement?.number || '-'}]</font>[R]<font size='small'>${z?.Remboursement?.amount || '-'}</font> \n` +
                            "[L]\n" +
                            "[L]\n" +
                            "[L]<u><font size='wide'>3-CHIFFRE D'AFFAIRE </font> </u>\n" +
                            "[L]\n" +
                            `[L]<font size='small'>Total HT </font>[R]<font size='small'>${z?.allHT?.amount?.toFixed(2)}</font> \n` +
                            "[L]\n" +
                            Object.keys(z?.chiffre_d_affair)?.map((e) => {
                                if (!z?.chiffre_d_affair[e].VAT) return "[C]\n ------ some of product are without TVA -------\n"
                                return `[L]<font size='small'>TVA  ${z?.chiffre_d_affair[e].VAT} %</font>[R]<font size='small'>[R]<font size='small'>[ ${z?.chiffre_d_affair[e].item} ] </font>[R]<font size='small'>[R]<font size='small'>[${z?.chiffre_d_affair[e].item}]</font>[R]<font size='small'> ${z?.chiffre_d_affair[e].price?.toFixed(2)}</font> \n`
                            }).join('') +
                            "[L]\n" +
                            "[L]\n" +
                            "[L]<u><font size='wide'>4-INFORMATION DE CLOTURE </font> </u>\n" +
                            "[L]\n" +
                            `[L]<font size='small'>Cheques</font>[R]<font size='small'>[C]<font size='small'></font>[C]<font size='small'>[L]<font size='small'>${cashInfo?.check || '-'}</font> \n` + //check
                            `[L]<font size='small'>CB</font>[R]<font size='small'>[C]<font size='small'></font>[C]<font size='small'>[L]<font size='small'>${cashInfo?.CB || '-'}</font> \n` +//carte bancaire
                            `[L]<font size='small'>Espaces</font>[R]<font size='small'>[C]<font size='small'></font>[C]<font size='small'>[L]<font size='small'>${cashInfo?.esp || '-'}</font> \n` + //espaces
                            `[L]<font size='small'>Bank </font>[R]<font size='small'>[C]<font size='small'></font>[C]<font size='small'>[L]<font size='small'>${cashInfo?.bank || 0}</font> \n` +//autres
                            `[L]<font size='small'>Credit </font>[R]<font size='small'>[C]<font size='small'></font>[C]<font size='small'>[L]<font size='small'>${cashInfo?.credit || '-'}</font> \n` +//autres
                            `[L]<font size='small'>Room </font>[R]<font size='small'>[C]<font size='small'></font>[C]<font size='small'>[L]<font size='small'>${cashInfo?.room || '-'}</font> \n` +//autres
                            "[L]\n" +

                            "[L]\n"
                        ) +
                        '[L]------------------------------------------------\n' +
                        "[L]\n" +
                        `[C]<font size='wide'>Produits:</font>\n` +
                        "[L]\n" +
                        b?.sort(a => a.product?.status)?.map((a) => {

                            if (a?.status !== 'cancel')
                                return (
                                    `[L]<font size='small'>${a?.product?.itemName} </font>[R]<font size='small'>${a?.n} </font> [R]<font size='small'>${a?.n * a?.product?.price}</font> \n`


                                )
                        }).join('') +
                        "[L]\n" +
                        "[L]\n" +

                        (!isMaster ?
                            '' :
                            '[L]------------------------------------------------\n' +
                            "[L]\n" +
                            `[C]<font size='wide'>Ventes:</font>\n` +
                            `[L]<font size='small'>Ventes du jour:</font>[R]<font size='small'>${z?.data?.priceTickets}</font>\n` +
                            `[L]<font size='small'>Articles Annulees:</font>[R]<font size='small'>${z?.canceledOrders}</font>\n` +
                            `[L]<font size='small'>Articles Offertes:</font>[R]<font size='small'>${z?.Offer?.amount}</font>\n\n` +
                            `[L]<font size='small'>Produits annulees: \n` +
                            b?.sort(a => a.product?.status)?.map((a) => {
                                if (a?.status == 'cancel')
                                    return `[L] <font size='small'>  - ${a?.product?.itemName} </font>[R]<font size='small'>${a?.n} </font> [R]<font size='small'>${a?.n * a?.product?.price}</font> \n`
                            }).join('') +
                            "[L]\n"
                        ) +

                        "[L]\n" +
                        "[L]\n" +
                        "[L]\n" +
                        "[L]\n" +
                        '[L]------------------------------------------------\n' +
                        "[L]\n" +
                        `[L]<font size='small'>Found de caisse initial </font>[R]<font size='small'>${0}</font> \n` +
                        `[L]<font size='small'>Montant encaisse </font>[R]<font size='small'>${sumCashBox(cashBox[0]) || 0}</font> \n` +
                        "[L]\n" +
                        `[L]<font size='small'>Fond de caisse final </font>[R]<font size='small'>${sumCashBox(cashInfo) || 0}</font> \n` +
                        `[L]<font size='small'>Ecart de caisse </font>[R]<font size='small'>${sumCashBox({ esp: z?.cash?.amount, CB: z?.creditCard?.amount, bank: z?.Bank?.amount, check: z?.check?.amount, Room: z?.Room.amount, credit: z?.credit.amount, Offer: z?.Offer.amount }) - sumCashBox(cashInfo) || 0}</font> \n` +
                        "[L]\n" +
                        "[L]\n" +
                        "[L]\n" +
                        "[L]\n",
                    timeout: 3000
                }).catch((err) => {
                    alert(`Impossible de se connecter a l'imprimante : (${e.name})`)
                })
            }, 1);
        })


    }

    return (

        <Modal style={{ flex: 1 }} transparent statusBarTranslucent visible={showModalRapport}>
            <View style={{ backgroundColor: "#00000033", flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <KeyboardAvoidingView behavior='padding' >
                    <View style={{ backgroundColor: 'white', minWidth: "20%", padding: 15 }}>
                        <View style={{ alignItems: "flex-end" }}>
                            <TouchableHighlight underlayColor onPress={() => dispatch({ type: 'HIDE_RAPPORT_MODAL' })}>
                                <MaterialCommunityIcons name={'close'} color={'red'} size={25} />
                            </TouchableHighlight>
                        </View>
                        <Text>Information de caisse </Text>
                        <View style={{ padding: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ width: 200 }}>
                                <Text style={{ color: errorIndex.includes(1) ? "red" : 'black' }}>ESP <Text style={{ fontWeight: '700', color: errorIndex.includes(1) ? "red" : 'black', }}>({z?.cash?.amount || 0})</Text></Text>
                                <TextInput keyboardType='decimal-pad' value={cashInfo?.esp + ''} style={[{ borderWidth: StyleSheet.hairlineWidth, borderColor: error ? "red" : 'black', color: error ? "red" : 'black', borderRadius: 2, height: 35 }, { borderWidth: StyleSheet.hairlineWidth, borderColor: errorIndex.includes(1) ? "red" : 'black', }]} onChangeText={(txt) => setCashInfo((e) => { return { ...e, esp: parseFloat(txt) || '' } })} />
                            </View>
                            <View style={{ width: 200 }}>
                                <Text style={{ color: errorIndex.includes(2) ? "red" : 'black' }}>Check <Text style={{ fontWeight: '700', color: errorIndex.includes(2) ? "red" : 'black' }}>({z?.check?.amount || 0})</Text></Text>
                                <TextInput keyboardType='decimal-pad' value={cashInfo?.check + ''} style={[{ borderWidth: StyleSheet.hairlineWidth, borderColor: error ? "red" : 'black', color: error ? "red" : 'black', borderRadius: 2, height: 35 }, { borderWidth: StyleSheet.hairlineWidth, borderColor: errorIndex.includes(2) ? "red" : 'black', }]} onChangeText={(txt) => setCashInfo((e) => { return { ...e, check: parseFloat(txt) || '' } })} />
                            </View>
                        </View>
                        <View style={{ padding: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ width: 200 }}>
                                <Text style={{ color: errorIndex.includes(3) ? "red" : 'black' }}>CB <Text style={{ fontWeight: '700', color: errorIndex.includes(3) ? "red" : 'black' }}>({z?.creditCard?.amount || 0})</Text></Text>
                                <TextInput keyboardType='decimal-pad' value={cashInfo?.CB + ''} style={[{ borderWidth: StyleSheet.hairlineWidth, borderColor: error ? "red" : 'black', color: error ? "red" : 'black', borderRadius: 2, height: 35 }, { borderWidth: StyleSheet.hairlineWidth, borderColor: errorIndex.includes(3) ? "red" : 'black', }]} onChangeText={(txt) => setCashInfo((e) => { return { ...e, CB: parseFloat(txt) || '' } })} />
                            </View>
                            <View style={{ width: 200 }}>
                                <Text style={{ color: errorIndex.includes(4) ? "red" : 'black' }}>Bank <Text style={{ fontWeight: '700', color: errorIndex.includes(4) ? "red" : 'black' }}>({z?.Bank?.amount || 0})</Text></Text>
                                <TextInput keyboardType='decimal-pad' value={cashInfo?.bank + ''} style={[{ borderWidth: StyleSheet.hairlineWidth, borderColor: error ? "red" : 'black', color: error ? "red" : 'black', borderRadius: 2, height: 35 }, { borderWidth: StyleSheet.hairlineWidth, borderColor: errorIndex.includes(4) ? "red" : 'black', }]} onChangeText={(txt) => setCashInfo((e) => { return { ...e, bank: parseFloat(txt) || '' } })} />
                            </View>
                        </View>
                        <View style={{ padding: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ width: 200 }}>
                                <Text style={{ color: errorIndex.includes(5) ? "red" : 'black' }}>Credit <Text style={{ fontWeight: '700', color: errorIndex.includes(5) ? "red" : 'black' }}>({z?.credit?.amount || 0})</Text></Text>
                                <TextInput keyboardType='decimal-pad' value={cashInfo?.credit + ''} style={[{ borderWidth: StyleSheet.hairlineWidth, borderColor: error ? "red" : 'black', color: error ? "red" : 'black', borderRadius: 2, height: 35 }, { borderWidth: StyleSheet.hairlineWidth, borderColor: errorIndex.includes(5) ? "red" : 'black', }]} onChangeText={(txt) => setCashInfo((e) => { return { ...e, credit: parseFloat(txt) || '' } })} />
                            </View>
                            <View style={{ width: 200 }}>
                                <Text style={{ color: errorIndex.includes(6) ? "red" : 'black' }}>Room <Text style={{ fontWeight: '700', color: errorIndex.includes(6) ? "red" : 'black' }}>({z?.Room?.amount || 0})</Text></Text>
                                <TextInput keyboardType='decimal-pad' value={cashInfo?.room + ''} style={[{ borderWidth: StyleSheet.hairlineWidth, borderColor: error ? "red" : 'black', color: error ? "red" : 'black', borderRadius: 2, height: 35 }, { borderWidth: StyleSheet.hairlineWidth, borderColor: errorIndex.includes(6) ? "red" : 'black', }]} onChangeText={(txt) => setCashInfo((e) => { return { ...e, room: parseFloat(txt) || '' } })} />
                            </View>
                        </View>


                        <View style={{ gap: 15, flexDirection: 'row', marginTop: 20 }}>
                            <View>
                                <TouchableHighlight
                                    onPress={PressXRapport}
                                >
                                    <View style={{ flexDirection: "row", alignItems: 'center', backgroundColor: 'black', padding: 10 }}>
                                        <MaterialCommunityIcons color={'white'} name={'notebook'} size={30} />
                                        <Text style={{ width: 150, color: 'white', marginLeft: 15 }}>X Rapport</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                            <View>
                                <TouchableHighlight

                                    onPress={async () => {
                                        let error = []
                                        if (z?.cash?.amount !== 0 && cashInfo.esp === 0 || !Number.isInteger(cashInfo.esp)) {
                                            error = [...error, 1]
                                        }

                                        if (z?.Bank?.amount !== 0 && cashInfo.bank === 0 || !Number.isInteger(cashInfo.bank)) {
                                            error = [...error, 4]
                                        }

                                        if (z?.check?.amount !== 0 && cashInfo.check === 0 || !Number.isInteger(cashInfo.check)) {
                                            error = [...error, 2]
                                        }

                                        if (z?.credit?.amount !== 0 && cashInfo.credit === 0 || !Number.isInteger(cashInfo.credit)) {
                                            error = [...error, 5]
                                        }

                                        if (z?.creditCard?.amount !== 0 && cashInfo.CB === 0 || !Number.isInteger(cashInfo.CB)) {
                                            error = [...error, 3]
                                        }

                                        if (z?.Room?.amount !== 0 && cashInfo.room === 0 || !Number.isInteger(cashInfo.room)) {
                                            error = [...error, 6]
                                        }

                                        setErrorIndex(error)
                                        if (error.length > 0)
                                            return
                                        else if (z.ableToClose?.r >= z.ableToClose?.i) {
                                            PressXRapport()

                                            setError(false)
                                            setLoading(true)
                                            CommandController.setDateZToCommand({
                                                ...cashInfo,
                                                pointOfSale,
                                                amountCash: z?.cash?.amount,
                                                amountCreditCard: z?.creditCard?.amount,
                                                amountBank: z?.Bank?.amount,
                                                amountCheck: z?.check?.amount,
                                                amountRoom: z?.Room?.amount,
                                                amountCredit: z?.credit?.amount,
                                                amountOffer: z?.Offer?.amount,
                                                uniqueId: await getUniqueId(),
                                                dbdid: await AsyncStorage.getItem('db_device_id'),
                                                orders,
                                                nbrPeople: z?.numberPeople
                                            }, () => {
                                                dispatch({ type: 'HIDE_RAPPORT_MODAL' });
                                                setLoading(false)
                                                dispatch(clearOrders())
                                                setCashInfo({ esp: 0, check: 0, CB: 0, bank: 0, room: 0, credit: 0 })

                                            }, () => {
                                                setLoading(false)
                                            })
                                        } else {
                                            console.log(z.ableToClose?.r == z.ableToClose?.i)
                                            Alert.alert('Closing issue', 'you have unpaid command? ',
                                                // [{
                                                //     text: 'Yes',
                                                //     onPress: async () => {
                                                //         // PressXRapport()
                                                //         // setError(false)
                                                //         // setLoading(true)
                                                //         // CommandController.setDateZToCommand({
                                                //         //     ...cashInfo,
                                                //         //     pointOfSale,
                                                //         //     amountCash: cash?.amount,
                                                //         //     amountCreditCard: creditCard?.amount,
                                                //         //     amountBank: Bank?.amount,
                                                //         //     amountCheck: check?.amount,
                                                //         //     amountRoom: Room?.amount,
                                                //         //     amountCredit: credit?.amount,
                                                //         //     amountOffer: Offer?.amount,
                                                //         //     uniqueId: await getUniqueId(),
                                                //         //     dbdid: await AsyncStorage.getItem('db_device_id'),
                                                //         //     orders,
                                                //         //     nbrPeople: numberPeople
                                                //         // }, () => {
                                                //         //     dispatch({ type: 'HIDE_RAPPORT_MODAL' });
                                                //         //     dispatch(clearOrders())
                                                //         //     setLoading(false)
                                                //         //     setCashInfo({ esp: 0, check: 0, CB: 0, bank: 0, room: 0, credit: 0 })

                                                //         // }, () => {
                                                //         //     setLoading(false)
                                                //         // })
                                                //     }
                                                // }, {
                                                //     text: 'No',
                                                //     onPress: () => { }
                                                // }
                                                // ]
                                            )
                                        }

                                    }}>
                                    <View style={{ flexDirection: "row", alignItems: 'center', backgroundColor: 'black', padding: 10 }}>
                                        <MaterialCommunityIcons color={'white'} name={'lock'} size={30} />
                                        <Text style={{ width: 150, color: 'white', marginLeft: 15 }}>Z Rapport</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>

                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View >
            {loading &&
                <View style={{
                    width: 200,
                    height: 100,
                    position: 'absolute',
                    left: ((width / 2) - 100),
                    top: ((height / 2) - 50),
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    borderColor: 'black',
                    borderWidth: StyleSheet.hairlineWidth,
                    borderRadius: 4,
                    elevation: 5,
                    gap: 5
                }}>
                    <ActivityIndicator size={25} />
                    <Text >Uploading data to Server</Text>
                </View>}
        </Modal >
    )
}

export { RapportModalType };

const styles = StyleSheet.create({})