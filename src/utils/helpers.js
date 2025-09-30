import AsyncStorage from "@react-native-async-storage/async-storage"
import moment from "moment"
import DeviceInfo from "react-native-device-info"
import { BSON } from "realm"

const ValidateIPaddress = (ipaddress) => {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
        return (true)
    }
    return (false)
}

const getPayload = ({ pointOfSale, user, orders, orderNumber, indexes = [], dublicata = false, facture = false }) => {

    try {
        const order = orders?.
            find((e) => e?.orderNumber == orderNumber)

        const d = order.
            commandProduct?.
            filter((e) => {
                return e?.sent >= e?.orderClassifying && e?.status != "cancel"
            })?.
            reduce((a, b) => {
                if (b.status == 'cancel') return a
                const index = a?.findIndex((e) => e?.p?._id + '' == '' + b?.product?._id && b?.linkToFormula == e?.linkToFormula)
                if (index >= 0) {
                    let aa = a;
                    aa[index].n += 1
                    try {
                        aa[index].addableIngredientsChoose = [...aa[index]?.addableIngredientsChoose, ...(b?.addableIngredientsChoose || [])]
                    } catch (error) {

                    }
                    try {
                        aa[index].addableProductsChoose = [...aa[index]?.addableProductsChoose, ...(b?.addableProductsChoose || [])]
                    } catch (error) {

                    }

                    return aa
                } else {
                    return [...a, { p: b?.product, addableIngredientsChoose: b?.addableIngredientsChoose, addableProductsChoose: b?.addableProductsChoose || [], sent: b?.sent, orderClassifying: b?.orderClassifying, status: b?.status, n: 1, linkToFormula: b?.linkToFormula, addablePrice: b?.addablePrice }]
                }
            }, [])
        const dd = order?.
            commandProduct?.
            reduce((a, b) => {
                if (b.status != 'cancel') return a
                const index = a?.findIndex((e) => e?.p?._id + '' == '' + b?.product?._id && b?.linkToFormula == e?.linkToFormula)
                if (index >= 0) {
                    let aa = a;
                    aa[index].n += 1
                    try {
                        aa[index].addableIngredientsChoose = [...(aa[index]?.addableIngredientsChoose || []), ...(b?.addableIngredientsChoose || [])]
                    } catch (error) {

                    }
                    try {
                        aa[index].addableProductsChoose = [...(aa[index]?.addableProductsChoose || []), ...(b?.addableProductsChoose || [])]
                    } catch (error) {

                    }
                    return aa
                } else {
                    return [...a, { p: b?.product, addableIngredientsChoose: b?.addableIngredientsChoose, addableProductsChoose: b?.addableProductsChoose, sent: b?.sent, orderClassifying: b?.orderClassifying, status: b?.status, n: 1, linkToFormula: b?.linkToFormula, addablePrice: b?.addablePrice }]
                }
            }, [])
        let tsubtotal = 0
        const total = order?.commandProduct?.
            filter((e) => {
                return e?.sent >= e?.orderClassifying
            })?.
            reduce((total, { product, addableIngredientsChoose, addableProductsChoose, linkToFormula, addablePrice, clickCount, status }) => {
                if (status == 'cancel') return total
                let subtotal = addableIngredientsChoose?.reduce((t, a) => {
                    let aaa = a?.options?.reduce((i, j) => i + j?.price * j?.quantity, 0)
                    return t + aaa
                }, 0) || 0
                let subtotalproduct = addableProductsChoose?.reduce((t, a) => {
                    let aaa = a?.options?.reduce((i, j) => i + j?.price * j?.quantity, 0)
                    return t + aaa
                }, 0) || 0

                return total + ((linkToFormula ? addablePrice : product?.price * clickCount) + subtotal + subtotalproduct);
                // return total + product?.price * clickCount;
            }, 0)

        const paid = order?.paidHistory?.reduce((total, { amount }) => {
            return total + amount;
        }, 0);
        const account = order?.paidHistory?.reduce((total, { amount, payType }) => {
            if (payType == "account")
                return total + amount;
            return total
        }, 0);
        const tva = d?.map((e, index) => {

            if (e?.sent < e?.orderClassifying) return ''
            if (indexes?.length > 0 && !indexes.some(a => a == index)) return ''
            if (e.status != 'cancel') {
                return (e?.linkToFormula ? e?.addablePrice : e?.p?.price) - parseFloat((e?.linkToFormula ? e?.addablePrice : e?.p?.price) / (1 + ((e?.p?.VATSales || 0) / 100))).toFixed(2) * e?.n || 0
            }
            return 0
        })
        return (
            '[L]\n' +
            `[C]<font size='big'>${removeSpecialChars(pointOfSale?.title)}</font>\n` +
            '[L]\n' +
            `[C]<font size='small'>${pointOfSale?.email}</font>\n` +

            `[C]<font size='small'>+${pointOfSale?.phone}</font>\n` +
            `[C]<font size='small'>+${pointOfSale?.ice}</font>\n` +
            "[C]<font size='small'>***</font>\n" +
            '[L]\n' +
            `[L]<font size='small'>Ticket N°: ${order?.orderNumber}</font>\n` +
            `[L]<font size='small'>Table : ${order?.unit?.unitNumber || '-'}</font>\n` +
            `[L]<font size='samm'>${moment()?.format('dddd DD MMMM YYYY')}</font>[L]<font size='small'>${moment()?.format('HH:mm:ss')}</font>\n` +
            `[L]<font size='small'>N Personne:${order?.numberPeople}</font>\n` +
            `[L]<font size='small'>Servi by:${removeSpecialChars(user?.firstName)}</font>\n` +
            '[L]\n' +
            (
                facture ?
                    "[C]<font  size='big'>Facture</font>\n" +
                    `[C]ICE: ${order?.Ice}\n` +
                    `[C]Company: ${order?.Company}\n` +
                    `[C]\n` : ''
            ) +
            "[L]<font size='small'>------------------------------------------------</font>\n" +
            "[L]<font size='small'>QTE</font>[L]<font size='small'>ARTICLE</font>[R]<font size='small'></font>[R]<font size='small'>PRICE</font>\n" +
            "[L]<font size='small'>------------------------------------------------</font>\n" +
            d?.map((e, index) => {

                if (e?.sent < e?.orderClassifying) return ''
                if (indexes?.length > 0 && !indexes.some(a => a == index)) return ''
                if (e.status != 'cancel') {
                    let subtotal = e?.addableIngredientsChoose?.reduce((t, a) => {
                        let aaa = a?.options?.reduce((i, j) => i + j?.price * j?.quantity, 0)
                        return t + aaa
                    }, 0) || 0
                    let subtotalproduct = e?.addableProductsChoose?.reduce((t, a) => {
                        let aaa = a?.options?.reduce((i, j) => i + j?.price * j?.quantity, 0)
                        return t + aaa
                    }, 0) || 0
                    tsubtotal += parseFloat(e?.linkToFormula ? e?.addablePrice : (e?.p?.price * e?.n)) + ((subtotal > 0 || subtotalproduct > 0) ? parseFloat(subtotal + subtotalproduct) : 0)

                    return (
                        `[L]<font size='small'>${e?.n}</font>[L]<font size='small'>${removeSpecialChars(e?.p?.itemName?.slice(0, 25))}</font>[R]<font size='small'></font>[R]<font size='small'>${(e?.linkToFormula ? e?.addablePrice : (e?.p?.price * e?.n))}</font>\n` +
                        ((subtotal > 0 || subtotalproduct > 0) ? `[L]<font size='small'>-</font>[L]<font size='small'>Supplements</font>[R]<font size='small'></font>[R]<font size='small'>${(subtotal + subtotalproduct)}</font>\n` : '')

                    )
                }
            }).join('') +
            dd.map((e, index) => {

                if (e?.sent < e?.orderClassifying) return ''
                if (indexes?.length > 0 && !indexes?.some(a => a == index)) return ''
                if (e.status == 'cancel') {
                    let subtotal = e?.addableIngredientsChoose?.reduce((t, a) => {
                        let aaa = a?.options?.reduce((i, j) => i + j?.price * j?.quantity, 0)
                        return t + aaa
                    }, 0) || 0
                    let subtotalproduct = e?.addableProductsChoose?.reduce((t, a) => {
                        let aaa = a?.options?.reduce((i, j) => i + j?.price * j?.quantity, 0)
                        return t + aaa
                    }, 0) || 0

                    return (
                        `[L]<font size='small'>${e?.n}</font>[L]<font size='small'>${removeSpecialChars(e?.p?.itemName?.slice(0, 25))}</font>[R]<font size='small'></font>[R]<font size='small'> cancel</font>\n` +
                        ((subtotal > 0 || subtotalproduct > 0) ? `[L]<font size='small'>-</font>[L]<font size='small'>Supplements</font>[R]<font size='small'></font>[R]<font size='small'>${(subtotal + subtotalproduct)}</font>[R]<font size='small'> cancel</font>\n\n` : '')
                    )
                }
            }).join('') +
            '[L]\n' +
            '[L]\n' +
            "[C]<font size='small'>----------------------</font>\n" +
            '[L]\n' +
            "[R]<font size='wide'>TOTAL TTC: " + total + "</font>\n" +

            "[R]<font>Dont TVA : " + Math.abs(tva?.reduce((a, b) => b + a, 0).toFixed(2) || 0) + "</font>\n" +
            "[R]<font>Total HT : " + (total - parseFloat(tva?.reduce((a, b) => b + a, 0)).toFixed(2)) + "</font>\n" +
            '[L]\n' +
            '[L]\n' +
            "[R]<font  >Splited Amount : " + tsubtotal + "</font>\n" +
            '[L]\n' +
            ((dublicata && paid > 0) ? "[C] <font size='big' color='black'>dublicata</font>\n\n" : '') +
            (total <= paid ? "[C]<u><font size='big' color='bg-black'>Paye</font></u>\n" : "[C]<u><font size='big' color='bg-black'>Non Paye</font></u>\n") +
            (((total <= paid) && (order?.payAmount >= account) && order?.payAmount - account != 0) ? `\n[C]<u><font size='big'>Remboursement</font></u><u><font size='big'> ${order.payAmount - account}</font></u>\n` : '') +
            (order?.paidHistory?.length > 0 ?
                `[L]<font size='small'>------------------------------------------------</font>\n` +
                `[L]<font size='small'>Type</font>[L]<font size='small'>Info</font>[R]<font size='small'>Price</font>\n` +
                `[L]<font size='small'>------------------------------------------------</font>\n`
                : '') +
            order?.paidHistory?.map((e, index) => {
                return (`[L]<font size='small'>${getNameMethod(e?.payType)}</font>[L]<font size='small'>${e?.payType == 'tips' ? (e?.roomNumber + " - " + parseFloat(e?.firstName) + '%') : e?.roomNumber || (e?.payType == "offert" ? e?.offertBy : '---')}</font>[R]<font size='small'>${e?.amount}</font>\n`)
            }).join('') +
            '[L]\n' +
            '[L]\n' +
            "[C]<font size='small'>*******************</font>\n" +
            "[C]<font size='small'>Merci de votre visite</font>\n" +
            "[C]<font size='small'>A Bientot ...</font>\n" +
            '[L]\n' +
            '[L]\n' +
            '[L]\n' +
            '[L]\n' +
            '[L]\n'
        )

    } catch (error) {
        console.log('error', error)
    }

}

const getNameMethod = (type) => {

    if (type == 'creditCard') return 'CB'
    else if (type == 'cash') return 'ESP'
    else if (type == 'account') return 'account'
    else if (type == 'room') return 'Room'
    else if (type == 'offert') return 'offered by '
    else if (type == 'credit') return 'Credit'
    else if (type == 'bank') return 'Bank'
    else if (type == 'wire') return 'Check'
    else if (type == 'tips') return 'Voucher'
    else if (type == 'remise') return 'Discount'
    return 'other'
}

const getPayloadProduction = ({ orders, orderNumber, productionTypes, reprint = 1, isreprint = false, NextInKitchen }) => {


    const o = orders?.find((e) => e?.orderNumber == orderNumber)

    const one = 1
    let showOnlyNext = !o?.commandProduct.every((e) => e?.orderClassifying % 1 == 0)

    const d = o?.commandProduct?.filter((e) => {
        return e?.product?.productionTypes?.some((f) => productionTypes?.some(e => e?._id + '' == '' + f?._id))
    })?.reduce((a, b) => {
        if (b?.product?.option?.length > 0 && !b?.linkToFormula) {
            return [...a, { ...b, qte: 1 }]
        } else {
            let index = a?.findIndex(i => {
                return i?.product?._id == b?.product?._id && i?.orderClassifying == b?.orderClassifying && (i?.unid == b?.unid || !b?.product?.linkToFormula)
            })

            if (index >= 0) {
                a[index].qte += 1
                return a
            } else {
                let formula = {}
                if (b?.linkToFormula) {
                    formula = o?.commandProduct.find(a => {
                        return a?.product?.isFormula && a?.unid == b.unid
                    })

                }

                return [...a, { ...b, formula: [formula], qte: 1 }]
            }
        }
    }, [])


    const f = d?.filter((e) => !e.product?.isFormula && e?.orderClassifying >= e?.sent - (isreprint ? 1 : 0))
    const hasToDo = d?.some((e) => parseInt(e?.orderClassifying) == parseInt((e?.sent - (isreprint ? 1 : 0) + (showOnlyNext ? 0.5 : one))))
    let i = 0
    if (f?.length > 0 && hasToDo) {

        return (
            '[L]\n' +

            (isreprint ? `[C]<font size='big' color='black'>Correction</font>\n\n\n` : '') +
            (o?.type == 'onsite' ? `[L]<font size='big'>Table</font>` + `:<font size='big'>${o?.unit?.unitNumber}</font>` : '') +
            (o?.type != 'onsite' ? `[L]<font size='big'>Type</font>` + `:<font size='big'>${o?.type}</font>\n` : '') +
            `[R]<font size='big'>PAX</font>:<font size='big'>${o?.numberPeople}</font>\n` +
            `[L]<font >${moment().format('YYYY/MM/DD')}</font>[R]<font >${moment().format('HH:mm')}</font>\n` +

            `[L]<font size='meduim'>N:</font>:<font size='meduim'>${orderNumber}</font>\n` +

            `[L]<font size='small'>by:${removeSpecialChars(o?.user?.firstName)}</font>\n` +
            '[L]\n' +
            '[L]\n' +

            '[L]\n' +
            d?.
                sort((a, b) => a?.orderClassifying - b?.orderClassifying)?.
                filter((b) => !b?.product?.isFormula)?.
                map((e) => {
                    if (parseInt(e?.orderClassifying) != parseInt((e?.sent - (isreprint ? 1 : 0) + (showOnlyNext ? 0.5 : one))) && e?.sent != 0) return ""
                    if (e?.orderClassifying < e?.sent - (isreprint ? 1 : 0) + (showOnlyNext ? 0.5 : one)) return ''
                    const showLine = i != parseInt(e?.orderClassifying) && e?.sent == 0
                    i = parseInt(e?.orderClassifying)
                    return (
                        `[L]\n` +
                        (showLine ? "[L]<font size='small'>------------------------------------------------</font>\n" : '') +
                        (e?.formula?.map((a) => {
                            if (a?.product?.itemName)
                                return (
                                    `[L]<font size='wide' color='black'>${removeSpecialChars(a?.product?.itemName)}</font>[R]  \n`
                                )
                        })?.join('') || '') +
                       `[L]${e?.qte} X ${removeSpecialChars(e?.product?.itemName?.slice(0, 25))}[L]${e?.status === "cancel" ? `<font size='small' color='bg - black'> Cancel </font>` : ''}[R]<font size='small' >ser ${parseInt(e?.orderClassifying)}</font>\n` +

                        (e?.conditionsChoose?.map((a) => {
                            return (
                                `[L]   ${removeSpecialChars(a?.title?.slice(0, 40))}[R]  \n` +
                                a?.options?.map((ea) => {
                                    return (
                                        `[L]        - ${removeSpecialChars(ea?.slice(0, 25))}[R] <font size='small' color='bg-black'></font>\n`
                                    )
                                })?.join('') || ''
                            )
                        })?.join('') || '') +

                        (e?.addableIngredientsChoose?.map((a) => {
                            return (
                                `[L]   ${a?.title?.slice(0, 40)?.normalize("NFD")?.replace(/[\u0300-\u036f]/g, "")}[R]  \n` +
                                a?.options?.map((ea) => {
                                    return (
                                        `[L]        - ${ea?.quantity || 1} x ${removeSpecialChars(ea?.ingredient?.ingredientName?.slice(0, 25))}[R] <font size='small' color='bg-black'></font>\n`
                                    )
                                })?.join('') || ''
                            )
                        })?.join('') || '') +

                        (e?.addableProductsChoose?.map((a) => {
                            return (
                                `[L]   ${a?.title?.slice(0, 40)?.normalize("NFD")?.replace(/[\u0300-\u036f]/g, "")}[R]  \n` +
                                a?.options?.map((ea) => {
                                    return (
                                        `[L]        - ${ea?.quantity || 1} x ${removeSpecialChars(ea?.item?.product?.itemName?.slice(0, 25))}[R] <font size='small' color='bg-black'></font>\n`
                                    )
                                })?.join('') || ''
                            )
                        })?.join('') || '') +

                        (e?.removableIngredientsChoose?.map((a) => {
                            let option = e?.product?.option?.find(ee => ee?._id == a?.removableIngredient)?.ingredientsOptions
                            return (
                                `[L]   ${a?.title?.slice(0, 40)?.normalize("NFD")?.replace(/[\u0300-\u036f]/g, "")}[R]  \n` +
                                a?.options?.map((ea) => {
                                    return (
                                        `[L]        - ${removeSpecialChars(option?.find(v => v._id == ea)?.ingredientName?.slice(0, 25))}[R] <font size='small' color='bg-black'></font>\n`
                                    )
                                })?.join('') || ''
                            )
                        })?.join('') || '') +
                        (e?.note &&

                            `[L]   Note:[R]  \n` +
                            `[L]        - ${removeSpecialChars(e.note)}[R] <font size='small' color='bg-black'></font>\n`

                            || '')
                    )
                }).join('') +
            '[L]\n' +
            ((o?.note == 'null' || !o?.note || o?.note == 'undefined') ? '' : "[L]<u><font size='big' color='black'> Notes: </font ></u>\n") +
            '[L]\n' +
            `[L]<font size='small'>${(o?.note == 'null' || !o?.note || o?.note == 'undefined') ? '' : o?.note}</font >\n` +
            '[L]\n' +
            '[L]\n' +
            '[L]\n'
        )
    }
    return false

}

const getUniqueId = async () => {

    const uniqueId = await DeviceInfo.getUniqueId()
    const AssociateUniqueId = await AsyncStorage.getItem('AssociateUniqueId')
    return AssociateUniqueId ? AssociateUniqueId : uniqueId
}

const totalOfOrder = async (order) => {

    order?.commandProduct?.reduce((total, { product, addableIngredientsChoose, clickCount, status }) => {
        if (status == 'cancel') return total
        let subtotal = addableIngredientsChoose.reduce((t, a) => {
            let aaa = a?.options.reduce((i, j) => i + j?.price * j?.quantity, 0)
            return t + aaa
        }, 0) || 0

        return total + ((product?.price * clickCount) + subtotal);
        // return total + product?.price * clickCount;
    }, 0)
}

const getOrderObject = async ({ saved = false, commandProduct = [], type = "collect", unit = null, user, pointOfSale, numberPeople = 1, origin = 'pos', nextInKitchen = 0, orderNumber = moment().valueOf(), _id = new BSON.ObjectId(), }) => {
    const rltm = await AsyncStorage.getItem('realTimeOrder')
    const a = {
        commandProduct,
        type,
        saved,
        orderNumber,
        nextInKitchen,
        origin,
        numberPeople,
        pointOfSale,
        user,
        realTime: rltm == 'true' || false,
        uniqueId: await getUniqueId(),
        _id,
        unit
    }

    return a
}


function removeSpecialChars(str) {
    return str
        ?.normalize('NFD')
        ?.replace(/[\u0300-\u036f]/g, '')
        ?.replace(/[^a-zA-Z0-9 ]/g, '')
        ?.toUpperCase();
}
function checkIfOrderPayed(order) {
    const total = order?.commandProduct?.reduce((total, { addableIngredientsChoose, addableProductsChoose, product, clickCount, status, linkToFormula, addablePrice }) => {
        let subtotal = addableIngredientsChoose?.reduce((t, a) => {
            let aaa = a?.options.reduce((i, j) => i + j?.price * j?.quantity, 0)
            return t + aaa
        }, 0) || 0
        let subtotalproduct = addableProductsChoose?.reduce((t, a) => {
            let aaa = a?.options?.reduce((i, j) => i + j?.price * j?.quantity, 0)
            return t + aaa
        }, 0) || 0
        if (status == 'cancel')
            return total
        return total + ((linkToFormula ? addablePrice : product.price) * clickCount) + subtotal + subtotalproduct;
    }, 0)

    const totalPayed = order?.paidHistory?.reduce((total, { amount }) => {
        return total + amount;
    }, 0)

    return (totalPayed >= total && total > 0)
}
export {
    ValidateIPaddress,
    getPayload,
    getPayloadProduction,
    getUniqueId,
    getOrderObject,
    totalOfOrder,
    checkIfOrderPayed
}

