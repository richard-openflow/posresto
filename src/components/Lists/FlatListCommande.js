import React, { useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import moment from 'moment';
import ThermalPrinterModule from 'react-native-thermal-printer';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { navigate } from '../../../NavigationService';
import { deleteOrder, sendAllToKitchen } from '../../redux/actions/orderActions';
import { colors } from '../../theme/Styles';
import { getPayloadProduction } from '../../utils/helpers';
import { ConfirmationDirector } from '../ConfirmationDirector';
import { SelectItemToPrint } from '../SelectItemToPrint';

const { height } = Dimensions.get('screen')
const RenderItem = ({ isMaster, item, onPress, setOrderNum, pointOfSale, uniqueId, printer, user, orders, role, showDelete, confirmDelete, setCommand, setShow, zone, table }) => {
  const dispatch = useDispatch()
  const [showDetails, setShowDetails] = useState(false)

  const activeStaff = user//stuff?.filtered('active = true')[0]
  const total = item?.commandProduct?.reduce((total, { product, addableIngredientsChoose, addableProductsChoose, clickCount, status, linkToFormula, addablePrice }) => {
    if (status == 'cancel')
      return total


    let subtotal = addableIngredientsChoose?.reduce((t, a) => {
      let aaa = a?.options.reduce((i, j) => i + j?.price * j?.quantity, 0)
      return t + aaa
    }, 0) || 0

    let subtotalproduct = addableProductsChoose?.reduce((t, a) => {
      let aaa = a?.options.reduce((i, j) => i + j?.price * j?.quantity, 0)
      return t + aaa
    }, 0) || 0

    return (total + (linkToFormula ? addablePrice : product?.price) * clickCount) + subtotal + subtotalproduct;
  }, 0)

  const totalPayed = item?.paidHistory?.reduce((total, { amount }) => {

    return total + amount;
  }, 0) || 0

  const paidAccount = item?.paidHistory?.reduce((total, { amount, payType }) => {
    if (payType == 'account')
      return total + amount;
    return total
  }, 0)


  return (
    <View style={{ flexDirection: "column", position: 'relative' }}>
      {(item?.user?.firstName || item?.user?.lastName) && <Text style={{
        backgroundColor: activeStaff?._id + '' !== '' + item?.user?._id ? 'red' : colors.primary,
        position: 'absolute',
        zIndex: 100,
        fontSize: 8,
        color: 'white',
        paddingHorizontal: 10,
        right: 0
      }}>{item?.user?.lastName} {item?.user?.firstName}</Text>}
      <Text style={{
        position: 'absolute',
        zIndex: 100,
        fontSize: 8,
        color: 'black',
        paddingHorizontal: 10,
        left: 0,
        bottom: 0
      }}>{item?.uniqueId}</Text>
      <Text style={{
        backgroundColor: 'white',
        color: 'black',
        borderWidth: StyleSheet.hairlineWidth,
        position: 'absolute',
        zIndex: 100,
        fontSize: 8,
        paddingHorizontal: 10,
        left: 0,
        borderRadius: 3
      }}>{item?.origin || 'new'}</Text>
      <TouchableHighlight
        disabled={!isMaster}

        underlayColor onPress={() => setShowDetails(e => !e)} style={styles.item}>
        <View style={{ display: "flex", flexDirection: 'row', height: 70, }}>
          <TouchableHighlight onPress={() => { onPress(item) }} style={{ justifyContent: 'center', alignItems: 'center', }}>
            <View style={{ justifyContent: 'center', alignItems: 'center', width: 90, flexDirection: "row", borderRightColor: '#00000045', borderRightWidth: 1, paddingHorizontal: 5 }}>
              {item?.type == 'onsite' && <Text style={[styles.itemText, { color: 'red', fontSize: 30 }]}>{`${item?.unit?.unitNumber}`}</Text>}
              {item?.type == 'collect' &&
                <Fontisto color={'red'} name={'shopping-bag-1'} size={25} />
              }
              {item?.type == 'counter' &&
                <MaterialCommunityIcons color={'red'} name={'cash-register'} size={25} />
              }
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor
            onPress={() => {
              if (!(item?.uniqueId && item?.uniqueId != uniqueId && role != 'ROLE_POS'))
                setShowDetails(e => !e)
            }}
            delayLongPress={3000}
            onLongPress={() => {
              if (showDelete) {
                confirmDelete({
                  show: true,
                  callback: () => {
                    dispatch(deleteOrder(item?.orderNumber))
                  }
                })
              }
            }}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: "column", borderRightColor: '#00000045', borderRightWidth: 1, paddingHorizontal: 5 }}>
              <Text style={[styles.itemText, { width: 60, textAlign: "center", color: 'black', fontSize: 10 }]}>{moment(item?.createdAt).format('YYYY/MM/DD')}</Text>
              <Text style={[styles.itemText, { width: 60, textAlign: "center", color: 'black', fontSize: 16, marginTop: 10 }]}>{moment(item?.createdAt).format('HH:mm')}</Text>
            </View>
          </TouchableHighlight>

          <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: "row", borderRightColor: '#00000045', borderRightWidth: 1, paddingHorizontal: 5 }}>
            <Text style={[styles.itemText, { width: 50, textAlign: "right", color: totalPayed > 0 ? "black" : 'red' }]}> {total}</Text>

          </View>

          <View style={{ justifyContent: 'flex-start', alignItems: 'center', width: 100, flexDirection: "row", borderRightColor: '#00000045', borderRightWidth: 1, paddingHorizontal: 5 }}>
            {item?.type == 'onsite' && <Text style={[styles.itemText, { paddingHorizontal: 5, width: 100, color: 'black' }]} ellipsizeMode='tail'>{zone?.find(a => a?.nameSlug == item?.unit?.localization)?.name}</Text>}
          </View>

          <View style={{ justifyContent: 'flex-start', alignItems: 'center', flexDirection: "row", paddingHorizontal: 5, gap: 12, height: 70, paddingLeft: 10, flexGrow: 1 }}>
            {item?.commandProduct?.some(c => c.status == 'new' && c.sent == false) &&
              <View style={{ height: 70, flexDirection: "row", }}>
                <Text style={[styles.itemText, { textAlign: "center", color: 'white', fontSize: 20, backgroundColor: "black", paddingHorizontal: 10, borderRadius: 50, height: 30, marginTop: 20 }]}>{item?.commandProduct?.filter(c => c.status == 'new' && c.sent == false)?.length}</Text>
                <EvilIcons color={'grey'} style={{ marginLeft: -8 }} size={35} name={'sc-telegram'} />
              </View>
            }

            {item?.commandProduct?.some(c => c.status == 'new' && c.sent == true) &&
              <View style={{ height: 70, flexDirection: "row", }}>
                <Text style={[styles.itemText, { textAlign: "center", color: 'white', fontSize: 20, backgroundColor: "black", paddingHorizontal: 10, borderRadius: 50, height: 30, marginTop: 20 }]}>{item?.commandProduct?.filter(c => c.status == 'new' && c.sent == true)?.length}</Text>
                <EvilIcons color={colors.new} style={{ marginLeft: -8 }} size={35} name={'sc-telegram'} />
              </View>
            }

            {item?.commandProduct?.some(c => c.status == 'inprogress') &&
              <View style={{ height: 70, flexDirection: "row", }}>
                <Text style={[styles.itemText, { textAlign: "center", color: 'white', fontSize: 20, backgroundColor: "black", paddingHorizontal: 10, borderRadius: 50, height: 30, marginTop: 20 }]}>{item?.commandProduct?.filter(c => c.status == 'inprogress')?.length}</Text>
                <EvilIcons color={colors.inprogress} style={{ marginLeft: -8 }} size={35} name={'clock'} />
              </View>
            }

            {item?.commandProduct?.some(c => c.status == 'awaiting') &&
              <View style={{ height: 70, flexDirection: "row", }}>
                <Text style={[styles.itemText, { textAlign: "center", color: 'white', fontSize: 20, backgroundColor: "black", paddingHorizontal: 10, borderRadius: 50, height: 30, marginTop: 20 }]}>{item?.commandProduct?.filter(c => c.status == 'awaiting')?.length}</Text>
                <EvilIcons color={colors.awaiting} style={{ marginLeft: -8 }} size={35} name={'bell'} />
              </View>
            }

            {item?.commandProduct?.some(c => c.status == 'done') &&
              <View style={{ height: 70, flexDirection: "row", }}>
                <Text style={[styles.itemText, { textAlign: "center", color: 'white', fontSize: 20, backgroundColor: "black", paddingHorizontal: 10, borderRadius: 50, height: 30, marginTop: 20 }]}>{item?.commandProduct?.filter(c => c.status == 'done')?.length}</Text>
                <EvilIcons color={colors.done} style={{ marginLeft: -8 }} size={35} name={'check'} />
              </View>
            }

            {item?.commandProduct?.some(c => c.status == 'cancel') &&
              <View style={{ height: 70, flexDirection: "row", }}>
                <Text style={[styles.itemText, { textAlign: "center", color: 'white', fontSize: 20, backgroundColor: "black", paddingHorizontal: 10, borderRadius: 50, height: 30, marginTop: 20 }]}>{item?.commandProduct?.filter(c => c.status == 'cancel')?.length}</Text>
                <EvilIcons color={colors.cancel} style={{ marginLeft: -8 }} size={35} name={'close-o'} />
              </View>
            }

          </View>
          <TouchableHighlight

            disabled={!isMaster}
            underlayColor onPress={() => {

              if (!(item?.commandProduct?.map((e) => e?.orderClassifying).every((f) => f <= item?.nextInKitchen))) {
                alert("You need to send all the products to kitchen or delete unsent product ")
                return
              }
              dispatch({ type: 'SHOW_PAY_TYPE', payload: item?.orderNumber })

            }} style={{ justifyContent: "center", alignItems: 'center', minWidth: 75, borderLeftColor: '#00000045', borderLeftWidth: 1, }}>
            <View style={{ justifyContent: 'flex-start', alignItems: 'center', flexDirection: "row", paddingHorizontal: 5 }}>
              <Text>{(item?.paidHistory && item?.paidHistory?.length != 0) ? item?.paidHistory.filter(a => a.amount > 0 && !a.cancelled)?.length + 'X' : ''}</Text>
              <EvilIcons color={!isMaster ? 'grey' : (totalPayed >= total ? 'green' : 'red')} size={35} name={'credit-card'} />
            </View>
          </TouchableHighlight>
          <TouchableHighlight

            disabled={!isMaster}
            underlayColor onPress={() => {

              if (item?.commandProduct?.map((e) => e?.orderClassifying).every((f) => f <= item?.nextInKitchen))
                return


              if (isMaster) {
                printer?.map((e) => {
                  if (e?.main) {
                    return null
                  }
                  if (!e?.enbaled) {
                    return null
                  }
                  const payload = getPayloadProduction({ pointOfSale, user, orders, orderNumber: item?.orderNumber, productionTypes: e?.productionTypes, reprint: 0 })
                  if (payload) {

                    ThermalPrinterModule.printTcp({
                      ip: e?.ipAdress,
                      port: e?.port,
                      autoCut: e.autoCut,
                      openCashbox: e.openCashbox,
                      printerNbrCharactersPerLine: e.printerNbrCharactersPerLine,
                      payload,
                      timeout: 3000
                    }).catch((err) => {
                      alert(`Impossible de se connecter a l'imprimante : (${e.name})`)
                    })
                  }

                })
              } else {
                tinyEmitter.emit('SENDDATA', { pointOfSale, user, orders, orderNumber: item?.orderNumber, reprint: 0, event: 'PRINTER_TICKET_PRODCUTOIN' })
              }
              dispatch(sendAllToKitchen({ _id: item?._id, orderNumber: item?.orderNumber }))
            }} style={{ justifyContent: "center", alignItems: 'center', minWidth: 75, borderLeftColor: '#00000045', borderLeftWidth: 1, }}>
            <View style={{ justifyContent: 'flex-start', alignItems: 'center', flexDirection: "row", paddingHorizontal: 5 }}>
              <MaterialCommunityIcons color={'black'} size={25} name={'send'} />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            // disabled={!isMaster}

            underlayColor onPress={() => {
              if (!(item?.commandProduct?.map((e) => e?.orderClassifying).every((f) => f <= item?.nextInKitchen))) {
                alert("You need to send all the products to kitchen or delete unsent product ")
                return
              }
              if (item?.nextInKitchen > 0) {
                setOrderNum(item?.orderNumber)
                setCommand(item)
              }
              else {
                alert("You need to send all the products to kitchen or delete unsent product")
              }
            }} style={{ justifyContent: "center", alignItems: 'center', minWidth: 75, borderLeftColor: '#00000045', borderLeftWidth: 1, }}>
            <View style={{ justifyContent: 'flex-start', alignItems: 'center', flexDirection: "row", paddingHorizontal: 5 }}>
              <FontAwesome color={!isMaster ? 'grey' : 'black'} size={25} name={'gears'} />
            </View>
          </TouchableHighlight>
        </View>
      </TouchableHighlight>
      {showDetails &&
        <View style={{ width: '100%', paddingHorizontal: 15, backgroundColor: "white", borderBottomColor: "#00000010", borderTopWidth: StyleSheet.hairlineWidth, flexDirection: 'row' }}>
          <View style={{ width: '75%', padding: 15, backgroundColor: "white", }}>
            <Text style={{ color: 'black', }} numberOfLines={1} ellipsizeMode='tail'>Order Details</Text>
            <Text style={{ color: 'black', marginBottom: 15, fontSize: 12 }} numberOfLines={1} ellipsizeMode='tail'>Number of people: {item?.numberPeople}</Text>
            {item?.commandProduct?.map((it) => {
              return (
                <>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 5 }}>
                    {it?.status == 'new' && <EvilIcons color={it?.sent ? colors.new : 'grey'} style={{}} size={25} name={'sc-telegram'} />}
                    {it?.status == 'inprogress' && <EvilIcons color={colors.inprogress} style={{}} size={25} name={'clock'} />}
                    {it?.status == 'awaiting' && <EvilIcons color={colors.awaiting} style={{}} size={25} name={'bell'} />}
                    {it?.status == 'done' && <EvilIcons color={colors.done} style={{}} size={25} name={'check'} />}
                    {it?.status == 'cancel' && <EvilIcons color={colors.cancel} style={{}} size={25} name={'close-o'} />}
                    <Text style={{ width: 100, textDecorationLine: it?.status == 'cancel' ? 'underline line-through ' : 'none', color: 'black' }} numberOfLines={1} ellipsizeMode='tail'>{it?.product?.itemName}</Text>
                    <Text style={{ width: 30, textDecorationLine: it?.status == 'cancel' ? 'underline line-through' : 'none', color: 'black' }} numberOfLines={1} ellipsizeMode='tail'>{it?.linkToFormula ? it?.addablePrice : it?.product?.price}</Text>
                  </View>
                  <View style={{ marginLeft: 40 }}>
                    {it?.conditionsChoose?.map((e) => {
                      return (
                        <>
                          <Text style={{ fontSize: 14, color: "black", marginVertical: 5 }}>{e.title}</Text>
                          {e.options.map(a => {
                            return (
                              <Text style={{ fontSize: 12, color: "black", marginLeft: 15 }}> - {a}</Text>
                            )
                          })}
                        </>

                      )
                    })}

                    {it?.addableIngredientsChoose?.map((e) => {
                      return (
                        <>
                          <Text style={{ fontSize: 14, color: "black", marginVertical: 5 }}>{e.title}</Text>
                          {e?.options?.map(a => {
                            return (
                              <Text style={{ fontSize: 12, color: "black", marginLeft: 15 }}> {a?.quantity || 1}X {a?.ingredient?.ingredientName}</Text>
                            )
                          })}
                        </>

                      )
                    })}
                    {it?.addableProductsChoose?.map((e) => {
                      return (
                        <>
                          <Text style={{ fontSize: 14, color: "black", marginVertical: 5 }}>{e.title}</Text>
                          {e?.options?.map(a => {
                            return (
                              <View style={{ flexDirection: 'row' }}>
                                <Text style={{ fontSize: 12, color: "black", marginLeft: 15 }}> {a?.quantity || 1}X {a?.item?.product?.itemName}</Text>
                                <Text style={{ fontSize: 12, color: "black", marginLeft: 15 }}> {a?.price}</Text>
                              </View>
                            )
                          })}
                        </>

                      )
                    })}
                    {it?.removableIngredientsChoose?.map((e) => {
                      return (
                        <>
                          <Text style={{ fontSize: 14, color: "black", marginVertical: 5 }}>{e.title}</Text>
                          {e.options.map(a => {
                            let option = it?.product?.option?.find(ee => ee?._id == e?.removableIngredient)?.ingredientsOptions
                            return (
                              <Text style={{ fontSize: 12, color: "black", marginLeft: 15 }}> - {option.find(v => v._id == a)?.ingredientName}</Text>
                            )
                          })}
                        </>

                      )
                    })}
                  </View>
                </>
              )
            })}

          </View>
          <View style={{ height: '100%', width: StyleSheet.hairlineWidth, backgroundColor: 'black' }} />
          <View style={{ width: '25%', maxHeight: '100%', padding: 15, backgroundColor: "white", }}>
            <Text style={{ color: 'black', marginBottom: 15 }} numberOfLines={1} ellipsizeMode='tail'>Payment Details</Text>
            {item?.paidHistory?.map((it) => {
              if (it?.amount < 0)
                return null
              return (
                <TouchableHighlight
                  disabled={!(it.amount > 0 && !it.cancelled)}
                  onPress={() => {
                    setShow({
                      data: {

                        ...it,
                        orderNumber: item.orderNumber,
                        _id: new Realm.BSON.ObjectID(),
                        amount: -it?.amount,
                        cancelled: new Realm.BSON.ObjectID(it?._id),
                      },
                      show: true
                    })
                  }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 3 }}>
                    {it?.payType == 'creditCard' && <MaterialCommunityIcons color={it?.cancelled ? 'gray' : (it?.amount > 0 ? 'green' : 'red')} name={'credit-card-outline'} size={20} />}
                    {it?.payType == 'account' && <MaterialCommunityIcons color={it?.cancelled ? 'gray' : (it?.amount > 0 ? 'green' : 'red')} name={'credit-card-outline'} size={20} />}
                    {it?.payType == 'cash' && <FontAwesome5 color={it?.cancelled ? 'gray' : (it?.amount > 0 ? 'green' : 'red')} name={'coins'} size={20} />}
                    {it?.payType == 'bank' && <MaterialCommunityIcons color={it?.cancelled ? 'gray' : (it?.amount > 0 ? 'green' : 'red')} name={'bank'} size={20} />}
                    {it?.payType == 'wire' && <MaterialCommunityIcons color={it?.cancelled ? 'gray' : (it?.amount > 0 ? 'green' : 'red')} name={'transfer'} size={20} />}
                    {it?.payType == 'room' && <Fontisto color={it?.cancelled ? 'gray' : (it?.amount > 0 ? 'green' : 'red')} name={'room'} size={20} />}
                    {it?.payType == 'credit' && <FontAwesome5 color={it?.cancelled ? 'gray' : 'red'} name={'hand-holding-usd'} size={20} />}
                    {it?.payType == 'offert' && <FontAwesome5 color={it?.cancelled ? 'gray' : (it?.amount > 0 ? 'green' : 'red')} name={'info'} size={20} />}
                    {it?.payType == 'remise' && <MaterialCommunityIcons color={it?.cancelled ? 'gray' : (it?.amount > 0 ? 'green' : 'red')} name={'ticket-percent'} size={20} />}

                    <Text style={{ marginLeft: 10, color: it?.payType == 'credit' ? "red" : it?.cancelled ? 'gray' : (it?.amount > 0 ? 'green' : 'red'), width: 50, textDecorationLine: it?.cancelled ? 'line-through' : 'none' }} numberOfLines={1} ellipsizeMode='tail'>{it?.amount}</Text>

                    {it?.payType == 'creditCard' && <Text style={{ textDecorationLine: it?.cancelled ? 'line-through' : 'none' }}> Paid By Credit card</Text>}
                    {it?.payType == 'account' && <Text style={{ textDecorationLine: it?.cancelled ? 'line-through' : 'none' }}> Account</Text>}
                    {it?.payType == 'cash' && <Text style={{ textDecorationLine: it?.cancelled ? 'line-through' : 'none' }}> Paid By Cash</Text>}
                    {it?.payType == 'bank' && <Text style={{ textDecorationLine: it?.cancelled ? 'line-through' : 'none' }}> Paid  By Bank</Text>}
                    {it?.payType == 'wire' && <Text style={{ textDecorationLine: it?.cancelled ? 'line-through' : 'none' }}> Paid By Wire</Text>}
                    {it?.payType == 'room' && <Text style={{ textDecorationLine: it?.cancelled ? 'line-through' : 'none' }}> Room {it?.roomNumber} {it?.firstName}</Text>}
                    {it?.payType == 'credit' && <Text style={{ textDecorationLine: it?.cancelled ? 'line-through' : 'none' }}> Credit To {it?.firstName} {it?.lastName}</Text>}
                    {it?.payType == 'offert' && <Text style={{ textDecorationLine: it?.cancelled ? 'line-through' : 'none' }}> Offret By {it?.offertBy}</Text>}
                    {it?.payType == 'remise' && <Text style={{ textDecorationLine: it?.cancelled ? 'line-through' : 'none' }}> Discount</Text>}
                  </View>


                </TouchableHighlight>

              )
            })}
            {(item?.paymentRequired && ((item.payAmount - paidAccount) || 0) != 0) &&
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 3 }}>
                <MaterialCommunityIcons color={'red'} name={'credit-card-outline'} size={20} />
                <Text style={{ marginLeft: 10, color: 'red', width: 50, }} numberOfLines={1} ellipsizeMode='tail'>{(item.payAmount - paidAccount) || 0}</Text>
                <Text style={{}}> Remboursement </Text>
              </View>}
            {(item?.paidHistory?.length == 0 && !((item?.paymentRequired && ((item.payAmount - paidAccount) || 0) != 0))) && <Text> No Payment Yet</Text>}
          </View>
        </View>
      }
    </View>

  );
};

const keyExtractor = item => item?.id;

const FlatListCommande = ({ isMaster, data = [], uniqueId, showDelete = false, confirmDelete = () => { } }) => {
  const [command, setCommand] = useState({})
  const [orderNum, setOrderNum] = useState(null);
  const [showPrinter, setShowPrinter] = useState(false)
  const [show, setShow] = useState({
    show: false,
    data: {}
  })
  const dispatch = useDispatch()
  const { printer } = useSelector(state => state.printer)
  const { orders } = useSelector(state => state.order)
  const { stuff, activeStuff } = useSelector(state => state.stuff)
  const { currentRestaurant: pointOfSale, role } = useSelector(state => state.user)
  const [indexes, setIndexes] = useState([])
  const user = activeStuff

  const { zone } = useSelector(state => state.zone)
  const { table } = useSelector(state => state.table)
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data?.reverse()}
        style={{ maxHeight: height - 160 }}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: "#00000010", }} />}
        renderItem={({ item }) => {

          let paidWithCash = item?.paidHistory?.every((e) => e?.payType == 'cash') || false

          return (
            <RenderItem
              setCommand={setCommand}
              show={show}
              setShow={setShow}
              confirmDelete={confirmDelete}
              isMaster={isMaster}
              showDelete={showDelete && paidWithCash && !item?.realTime}
              role={role}
              uniqueId={uniqueId}
              printer={printer}
              stuff={stuff}
              user={user}
              setOrderNum={(txt) => {
                setOrderNum(txt)
                setShowPrinter(true)
              }}
              item={item}
              orders={orders}
              pointOfSale={pointOfSale}
              zone={zone}
              table={table}
              onPress={() => { navigate('control', { orderNumber: item?.orderNumber }) }} />
          )
        }}
        keyExtractor={keyExtractor}
      />
      <ConfirmationDirector
        stuff={stuff}
        show={show}
        setShow={setShow}
      />

      <SelectItemToPrint
        indexes={indexes}
        setIndexes={setIndexes}
        dispatch={dispatch}
        Zone={zone}
        table={table}
        // Command={command}
        // selectOrder={selectOrder}


        printer={printer}
        orders={orders}
        orderNumber={orderNum}
        showPrinter={showPrinter}
        setShowPrinter={setShowPrinter}
        pointOfSale={pointOfSale}
        user={user} />
    </View>
  );
};

export { FlatListCommande };

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
  },
  itemText: {

    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flexGrow: 1,
    backgroundColor: 'white',

  },
  closeButton: {
    height: 30,
    width: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#00000088"
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

});




