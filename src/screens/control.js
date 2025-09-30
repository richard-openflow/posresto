import { Realm } from '@realm/react';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { Button } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import tinyEmitter from 'tiny-emitter/instance';
import { CategorieList } from '../components/Lists/CategorieList';
import { MenuList } from '../components/Lists/MenuList';
import { ProduitList } from '../components/Lists/ProduitList';
import { ModalCancelPremission } from '../components/ModalCancelPremission';
import { ModalKeyPadSelector } from '../components/ModalKeyPadSelector';
import { ModalNoteToKitchen } from '../components/ModalNoteToKitchen';
import { ModalSelectTypeOfCommand } from '../components/ModalSelectTypeOfCommand';
import { ModalProfileViewer } from '../components/ProfileModalViewer';

import 'moment/locale/fr';
import ThermalPrinterModule from 'react-native-thermal-printer';
import { ModalStuffPinPadSelector } from '../components/ModalStuffPinPadSelector';
import SelectedProducts from '../components/SelectedProducts';
import { SelectItemToPrint } from '../components/SelectItemToPrint';

import moment from 'moment';
import { useForm } from 'react-hook-form';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { BSON } from 'realm';
import { ModalOptionSelector } from '../components/modalOptionSelector';
import { MultipleProductModal } from '../components/MultipleProductModal';
import { QuickViewModal } from '../components/QuickViewModal';
import { addContactToOrder, AddProductToOrder, createOrder, sendAllToKitchen } from '../redux/actions/orderActions';
import { getOrderObject, getPayloadProduction, getUniqueId } from '../utils/helpers';

const { width, height } = Dimensions.get("screen")
const ControlScreen = ({ route }) => {
  const dispatch = useDispatch();
  const { control, setValue, getValues } = useForm({
    defaultValues: {
      selectedMenuId: null,
      selectedCategoryId: null,
      categorieList: [],
      productList: [],
      orderNumber: null,
      selectedProductsList: [],
    }
  })

  // const [produitList, setProduitList] = useState([]);
  // const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState({ product: null, clickCount: 0 });
  // const [selectedProducts, setSelectedProducts] = useState([]);
  //  const { height } = Dimensions.get("window")
  const [show, setShow] = useState(false);
  // const [showSent, setShowSent] = useState(false);
  // const [oneTimeActivited, setOneTimeActivited] = useState(false);
  // const [oneTimeProducts, setOneTimeProducts] = useState([]);
  const [block, setBlock] = useState(false);
  const [orderNumber, setOrderNumber] = useState();
  const [command, setCommand] = useState({})
  // const [selectedProductsList, setSelectedProductsList] = useState([]);
  const [scroll, setScroll] = useState({ scrollPosition: 0 })
  const [showPin, setShowPin] = useState(true)
  const [showPrinter, setShowPrinter] = useState(false)
  const [expand, setExpand] = useState(true)
  // const [selectOrder, setSelectOrder] = useState({})
  const [showDouble, setShowDouble] = useState(false)
  const [visible, setVisible] = useState(false)
  const [formule, setFormule] = useState({
    show: false,
    product: null,
    addablePrice: 0,
    unid: null
  })

  const { currentRestaurant: pointOfSale, role, isMaster, isLinked } = useSelector(state => state.user)
  const { unitNumber } = useSelector(state => state.Modal)
  const { menu } = useSelector(state => state.menu)
  const { orders, uniqueId } = useSelector(state => state.order)
  const { zone } = useSelector(state => state.zone)
  const { printer } = useSelector(state => state.printer)
  const { table } = useSelector(state => state.table)
  const { stuff, activeStuff } = useSelector(state => state.stuff)

  const [currentService, setCurrentService] = useState(1)
  const [dispearTheButton, setDispearTheButton] = useState(false)

  const [indexes, setIndexes] = useState([])
  const [showTransfer, setShowTransfer] = useState(false)

  const [selectedProductWithOption, setselectedProductWithOption] = useState({
    product: null,
  })
  const [ChooseOptions, setChooseOptions] = useState({
    conditionsChoose: [],
    addableIngredientsChoose: [],
    addableProductsChoose: [],
    removableIngredientsChoose: [],
    note: '',

  })

  const nextSerivce = (a, show = false, insert = false) => {
    if (insert) {

      return setCurrentService((e) => -a - 0.5)
    }
    setDispearTheButton(show)
    if (a) {
      setCurrentService((e) => a)
    }
    else {
      const aa = selectOrder?.commandProduct.reduce((a, b) => {
        if (b?.sent >= b?.orderClassifying && b?.status == 'new')
          return a
        return a + 1
      }, 0)

      setCurrentService((e) => e + (aa <= 1 ? 1 : 0))// tocheck 
    }

  }

  const selectOrder = orders.find((e) => e?.orderNumber == orderNumber)
  const total = selectOrder?.commandProduct?.reduce((total, { product, linkToFormula, addablePrice, clickCount, status, addableProductsChoose, addableIngredientsChoose }) => {
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

    return total + ((linkToFormula ? addablePrice : product?.price) * clickCount) + subtotal + subtotalproduct;
  }, 0)

  const totalPayed = selectOrder?.paidHistory?.reduce((total, { amount }) => {
    return total + amount;
  }, 0)


  useEffect(() => {
    setValue('selectedProductsList', [])
    setOrderNumber(null)
    setCurrentService(1)
    setTimeout(() => {
      setOrderNumber(route?.params?.orderNumber || null)
    }, 1);
  }, [route, route?.params?.orderNumber])

  useEffect(() => {
    let data = selectOrder?.commandProduct?.map((b) => {
      return b?.orderClassifying
    })
    if (data?.length > 0) {
      setCurrentService(parseInt(Math.max(...data)))
    } else {
      setCurrentService(1)
    }

    setFormule({
      show: false,
      addablePrice: 0,
      product: null,
      unid: false
    })
  }, [selectOrder])


  useEffect(() => {
    if (!isNaN(parseInt(unitNumber))) {
      setOrderNumber('' + unitNumber)
    } else {
      setOrderNumber(null)
    }
  }, [unitNumber])


  const handleProductPress = ({ product, linkToFormula, addablePrice, unid }) => {
    if (isLinked && !orderNumber) {
      alert('You are in mode connected, you cannot create command')
      return
    }
    if (orderNumber) {
      if (product?.option?.filter(a => a?.required).length == 0 || product.isFormula) {
        dispatch(AddProductToOrder({ product, orderNumber, currentService, clickCount: 1, linkToFormula, addablePrice, unid }, () => { alert('Order have been deleted') }))
        setDispearTheButton(true)

      }
      else {

        if (!product?.isFormula)
          setselectedProductWithOption({ product, linkToFormula, addablePrice, unid })
      }
    }
    if (currentService < 0)
      setCurrentService(parseInt(Math.abs(currentService)))
  };

  const DoubleProduct = async (data) => {
    if (isLinked && !orderNumber) {
      alert('You are in mode connected, you cannot create command')
      return
    }
    if (orderNumber) {
      if (selectedProduct?.product.option.length == 0) {
        dispatch(AddProductToOrder({ product: selectedProduct?.product, orderNumber, currentService, clickCount: data }, () => { alert('Order have been deleted') }))
        setDispearTheButton(true)
      }
      else {
        alert('This product has options')
      }
    } else {

      if (selectedProduct?.product.option.length == 0) {

        let a = []
        a.push({ product: selectedProduct?.product, clickCount: data, sent: 0, _id: new Realm.BSON.ObjectID() })
        setValue('selectedProductsList', [...getValues().selectedProductsList, ...a]);
      } else {
        alert('This product has options')
      }
    }
  }

  const handleDoublePress = () => { };

  const handleProductLongPress = ({ product, linkToFormula, addablePrice, unid }) => {
    if (isLinked && !orderNumber) {
      alert('You are in mode connected, you cannot create command')
      return
    }
    if (selectOrder) {
      const total = selectOrder?.commandProduct?.reduce((total, { addableIngredientsChoose, addableProductsChoose, product, clickCount, status, linkToFormula, addablePrice }) => {
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

      const totalPayed = selectOrder?.paidHistory?.reduce((total, { amount }) => {
        return total + amount;
      }, 0)

      if (totalPayed >= total && total > 0) {
        alert('Changes cannot be made to an order that has already been paid. Please create a new order')
        return
      }
    }
    setShowDouble(true)
    setSelectedProduct({ product, clickCount: 1, linkToFormula, addablePrice, unid })

  };

  useEffect(() => {

    const d = menu.filter((e) => activeStuff?.role == 'ROLE_DIRECTOR' || activeStuff?.accessibleMenu?.some((a) => a == e._id))[0] || {}
    if (d?._id) {
      setValue('selectedMenuId', d._id)
      setValue('categorieList', d?.CategoryMenu || [])
      setValue('selectedCategoryId', d?.CategoryMenu[0]?._id)
      setValue('productList', d?.CategoryMenu[0]?.products)
      tinyEmitter.off('clear-order-number')
      tinyEmitter.on('clear-order-number', () => {
        setValue('selectedProductsList', [])
        setOrderNumber(null)
        setDispearTheButton(false)
        setCurrentService((e) => 1)
      })
    }
  }, [activeStuff])

  const user = activeStuff

  return (
    <View style={{ flexGrow: 1, backgroundColor: '#ccc' }}>
      <View style={{ height: 50, flexDirection: 'row', borderBottomColor: "black", borderBottomWidth: StyleSheet.hairlineWidth, }}>
        {/**Start TOP List Menu   */}
        <View style={{ width: width - 300, position: 'relative', zIndex: 10000, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} >
          <MenuList onPress={() => {
            setFormule({
              show: false,
              product: null,
              addablePrice: 0,
              unid: null
            })
          }} setValue={setValue} control={control} data={menu} activeUser={activeStuff} />
          <View style={{ flexDirection: 'row', gap: 5, justifyContent: 'flex-end', alignItems: 'center', flexGrow: 1, backgroundColor: '#eee', height: 49, padding: 3 }}>
            <TouchableOpacity
              style={{ height: 45, width: 75, alignItems: 'center', justifyContent: 'center', backgroundColor: selectOrder?.type == 'collect' ? 'red' : 'black' }}
              onPress={async () => {

                setValue('selectedProductsList', [])

                setDispearTheButton(false)
                setCurrentService((e) => 1)
                const a = await getOrderObject({
                  commandProduct: [],
                  type: "collect",
                  orderNumber: moment().valueOf(),
                  nextInKitchen: 0,
                  origin: 'pos',
                  numberPeople: 1,
                  pointOfSale,
                  user: activeStuff,
                  _id: new BSON.ObjectId()
                })
                dispatch(createOrder({ order: a, currentRestaurant: pointOfSale?._id }))

                setOrderNumber(a?.orderNumber)
              }}>
              <Fontisto color={'white'} name={'shopping-bag-1'} size={25} />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ height: 45, width: 75, alignItems: 'center', justifyContent: 'center', backgroundColor: selectOrder?.type == 'onsite' ? 'red' : 'black' }}
              onPress={async () => {
                setValue('selectedProductsList', [])
                setOrderNumber(null)
                setDispearTheButton(false)
                setCurrentService((e) => 1)
                setShow(true)
                setBlock(true)
              }}>
              <MaterialCommunityIcons color={'white'} name={'table-furniture'} size={25} />
            </TouchableOpacity>

            <TouchableOpacity
              style={{ height: 45, width: 75, alignItems: 'center', justifyContent: 'center', backgroundColor: selectOrder?.type == 'counter' ? 'red' : 'black' }}
              onPress={async () => {

                setValue('selectedProductsList', [])

                setDispearTheButton(false)
                setCurrentService((e) => 1)
                const a = await getOrderObject({
                  commandProduct: [],
                  type: "counter",
                  origin: 'pos',
                  numberPeople: 1,
                  orderNumber: moment().valueOf(),
                  pointOfSale,
                  user: activeStuff,
                  nextInKitchen: 0,
                  _id: new BSON.ObjectId()
                })
                dispatch(createOrder({ order: a, currentRestaurant: pointOfSale?._id }))
                setOrderNumber(a?.orderNumber)


              }}>
              <MaterialCommunityIcons color={'white'} name={'cash-register'} size={25} />
            </TouchableOpacity>
          </View>

        </View>
        <View style={{ width: 300, height: 50, paddingHorizontal: 15, borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: 'black', alignItems: "center", justifyContent: "space-between", flexDirection: "row", gap: 10 }}>
          <Text>{activeStuff?.firstName} {activeStuff?.lastName}</Text>
          <TouchableHighlight onPress={() => { setShowPin(true) }} style={{ height: 50, width: 50, justifyContent: 'center', alignItems: 'center' }}>
            <MaterialCommunityIcons color={'black'} name={'lock'} size={25} />
          </TouchableHighlight>
        </View>
        {orderNumber && <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 3, position: 'absolute', right: 1, bottom: 1 }}>
          <MaterialCommunityIcons name={selectOrder?.saved ? 'content-save' : 'content-save-off'} size={16} color={selectOrder?.saved ? 'green' : 'red'} />
        </View>}
      </View>
      <View style={{ flexGrow: 1, flexDirection: 'row' }}>
        <View style={{ width: width - 300, flexDirection: "row", }} >

          <CategorieList onPress={() => {
            setFormule({
              show: false,
              product: null,
              addablePrice: 0,
              unid: null
            })
          }} control={control} setValue={setValue} />
          <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: "#000", height: "100%" }} />

          <ProduitList orderNumber={orderNumber} formule={formule} setFormule={setFormule} role={role} ownership={selectOrder?.uniqueId && selectOrder?.uniqueId != uniqueId} paid={totalPayed >= total && total > 0} control={control} setValue={setValue} getValues={getValues} onLongPress={handleProductLongPress} onPress={handleProductPress} onDoublePress={handleDoublePress} />
        </View>
        <View style={{ borderLeftColor: 'black', backgroundColor: "white", borderLeftWidth: StyleSheet.hairlineWidth, width: 300, maxHeight: height - 45, }} >
          {orderNumber &&
            <View style={{ flexDirection: 'row', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "#00000045", justifyContent: 'space-between', alignItems: 'center' }}>
              {orderNumber &&
                <TouchableHighlight style={{ width: 50 }} underlayColor onPress={() => { dispatch({ type: 'SHOW_NOTE_KITCHEN', payload: orderNumber }) }}>
                  <View style={{ width: "100%", padding: 10, justifyContent: "flex-start", alignItems: "center", flexDirection: "row" }}>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 5 }}>
                      <MaterialCommunityIcons color={selectOrder?.note?.length > 0 ? 'red' : 'black'} name={'note'} size={25} />
                    </View>
                  </View>
                </TouchableHighlight>}

              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 3 }}>
                <MaterialIcons name={'dinner-dining'} size={18} color={'black'} />
                <Text style={{ fontWeight: '700', color: 'black', fontSize: 20 }}>{selectOrder?.commandProduct?.filter((d) => d?.status != 'cancel')?.length}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 3 }}>
                <Foundation name={'male'} size={18} color={'black'} />
                <Text style={{ fontWeight: '700', color: 'black' }}>{selectOrder?.numberPeople}</Text>
              </View>
              <TouchableHighlight underlayColor style={{}} onPress={() => setShow(true)}>
                <View style={{ padding: 10, justifyContent: "flex-start", alignItems: "center", flexDirection: "row" }}>
                  {
                    selectOrder?.type == 'onsite' &&
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 5 }}>
                      <Text style={{ color: 'red', fontSize: 24 }}>{selectOrder?.unit?.unitNumber}</Text>
                    </View>
                  }
                </View>
              </TouchableHighlight>
              <TouchableHighlight underlayColor style={{ height: 30, width: 30, justifyContent: 'center', alignItems: 'center', borderWidth: StyleSheet.hairlineWidth, marginRight: 10 }} onPress={() => { setExpand(e => !e) }}>
                <View style={{ flexDirection: 'row', backgroundColor: expand ? 'black' : 'white', justifyContent: 'center', alignItems: 'center', height: 30, width: 30, }}>
                  <Feather name={'minimize-2'} size={18} color={!expand ? 'black' : 'white'} />
                </View>
              </TouchableHighlight>
            </View>
          }

          <SelectedProducts
            setShowTransfer={setShowTransfer}
            setShowPrinter={setShowPrinter}
            indexes={indexes}
            setIndexes={setIndexes}
            activeStuff={activeStuff}
            formule={formule}
            setFormule={setFormule}
            expand={expand}
            currentService={currentService}
            ownership={selectOrder?.uniqueId && selectOrder?.uniqueId != uniqueId}
            setValue={setValue}
            getValues={getValues}
            scroll={scroll}
            setScroll={setScroll}
            nextSerivce={nextSerivce}
            dispearTheButton={dispearTheButton}
            orderNumber={orderNumber}
            onItemEditPress={(data) => {
              console.log({ data })
              setChooseOptions({
                ...data,
                conditionsChoose: data?.conditionsChoose || [],
                addableIngredientsChoose: data?.addableIngredientsChoose || [],
                removableIngredientsChoose: data?.removableIngredientsChoose || [],
                note: data.note || ''
              })
              setselectedProductWithOption({ product: data.product })
            }}

            setStateSendToKitchen={(product) => {
              setValue('selectedProductsList', getValues()?.selectedProductsList?.map(i => {
                if (i._id + '' !== product._id + '') return i
                return { ...i, sent: product?.sent == i?.sent }
              }))
            }}

            onDelete={(item) => {
              setValue('selectedProductsList', getValues()?.selectedProductsList?.filter(i => i._id + '' !== item._id + ''))
            }}
          />
          <View style={{ flexGrow: 1 }} />
          {
            selectOrder?.commandProduct?.length > 0 &&
            <View style={{ flexDirection: 'row' }}>

              <View style={{ justifyContent: "center", alignItems: 'center', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#00000045", paddingHorizontal: 5 }}>
                <View style={{ borderRadius: 35, width: 35, height: 35, borderWidth: StyleSheet.hairlineWidth, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
                  <Text style={{ color: "white", textAlign: 'center' }}> {selectOrder?.nextInKitchen || 0}</Text>
                </View>
              </View>
              <Button
                onPress={() => {

                  if (selectOrder?.commandProduct?.map((e) => e?.orderClassifying).every((f) => f <= selectOrder?.nextInKitchen))
                    return

                  let ord = JSON.parse(JSON.stringify(orders))
                  let nextk = selectOrder?.nextInKitchen

                  dispatch(sendAllToKitchen({ orderNumber: selectOrder?.orderNumber }))

                  if (isMaster) {
                    printer?.map((e) => {

                      if (e?.main) {
                        return null
                      }

                      if (!e?.enbaled) {
                        return null
                      }

                      const payload = getPayloadProduction({ pointOfSale, user, orders: ord, orderNumber, productionTypes: e?.productionTypes, reprint: 0, NextInKitchen: nextk/*selectOrder?.nextInKitchen*/ })

                      if (payload)
                        ThermalPrinterModule.printTcp({
                          ip: e?.ipAdress,
                          port: e?.port,
                          autoCut: e?.autoCut,
                          openCashbox: e?.openCashbox,
                          printerNbrCharactersPerLine: e?.printerNbrCharactersPerLine,
                          payload,
                          timeout: 10000
                        }).catch((err) => {
                          alert(`Impossible de se connecter a l'imprimante : (${e?.name})`)
                        })

                    })
                  } else {
                    tinyEmitter.emit('SENDDATA', { pointOfSale, user, orders: ord, orderNumber, reprint: 0, NextInKitchen: nextk, event: 'PRINTER_TICKET_PRODCUTOIN' })
                  }
                }}
                onLongPress={() => {
                  let ord = JSON.parse(JSON.stringify(orders))
                  if (isMaster) {
                    printer?.map((e) => {
                      if (e?.main) {
                        return null
                      }
                      if (!e?.enbaled) {
                        return null
                      }

                      const payload = getPayloadProduction({ pointOfSale, user, orders: ord, orderNumber, productionTypes: e?.productionTypes, reprint: 0, isreprint: true })
                      if (payload)
                        ThermalPrinterModule.printTcp({
                          ip: e?.ipAdress,
                          port: e?.port,
                          autoCut: e?.autoCut,
                          openCashbox: e?.openCashbox,
                          printerNbrCharactersPerLine: e?.printerNbrCharactersPerLine,
                          payload,
                          timeout: 3000
                        }).catch((err) => {
                          alert(`Impossible de se connecter a l'imprimante : (${e?.name})`)
                        })
                    })
                  } else {
                    tinyEmitter.emit('SENDDATA', { pointOfSale, user, orders: ord, orderNumber, reprint: 0, isreprint: true, event: 'PRINTER_TICKET_PRODCUTOIN' })
                  }
                }}
                style={{ borderRadius: 0, width: "35%", borderTopColor: "#00000045", borderTopWidth: StyleSheet.hairlineWidth, height: 54, textAlignVertical: 'center' }}
                contentStyle={{ height: 54, }}
                labelStyle={{ textAlignVertical: 'center', fontSize: 20 }}
                icon={"send"}
                textColor='black' />
              <View style={{ justifyContent: "center", alignItems: 'center', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#00000045", paddingHorizontal: 5 }}>
                <View style={{ borderRadius: 35, width: 35, height: 35, borderWidth: StyleSheet.hairlineWidth, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
                  <Text style={{ color: "white", textAlign: 'center' }}> {parseInt(Math.max(...selectOrder?.commandProduct?.map((e) => e?.orderClassifying))) || 0}</Text>
                </View>
              </View>
              <View style={{ width: StyleSheet.hairlineWidth, backgroundColor: 'black', height: 54, }} />

              <TouchableHighlight
                onPress={() => {
                  setVisible(true)

                }}
                style={{ flexGrow: 1, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#00000045" }}
              >
                <View style={{ height: 54, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                  <Feather name={'user'} size={28} />
                </View>
              </TouchableHighlight>
            </View>
          }
          <View style={{
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            borderTopWidth: StyleSheet.hairlineWidth,
          }} >
            <Text>{activeStuff?.firstName} {activeStuff?.lastName}</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: '#000',
            alignItems: "center",
            justifyContent: 'space-between',
            height: 75,
            paddingHorizontal: 3
          }}>
            <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
              <Button onPress={() => {
                setValue('selectedProductsList', [])
                setOrderNumber(null)
                setDispearTheButton(false)
                setCurrentService((e) => 1)
                setFormule({
                  show: false,
                  addablePrice: 0,
                  product: null,
                  unid: false
                })
              }} style={{ borderRadius: 0, width: 45, marginLeft: 4, height: 54, textAlignVertical: 'center' }}
                contentStyle={{ height: 54, }}
                labelStyle={{ textAlignVertical: 'center', fontWeight: '100', fontSize: 24 }}
                icon={'order-bool-ascending-variant'}
                textColor='black'></Button>
            </View>
            <View style={{ backgroundColor: 'black', width: StyleSheet.hairlineWidth, height: '50%' }} />
            <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', }}>
              <Button
                disabled={!isMaster}
                onPress={() => {
                  if (!(selectOrder?.commandProduct?.map((e) => e?.orderClassifying).every((f) => f <= selectOrder?.nextInKitchen))) {
                    alert("You need to send all the products to kitchen or delete unsent product ")
                    return
                  }
                  if (selectOrder?.uniqueId && selectOrder?.uniqueId != uniqueId && !isMaster) {
                    alert("You can't pay for an order that has been created from other device")
                    return
                  }
                  if (totalPayed >= total && total > 0) {
                    alert("You can't pay for an order that has already been paid")
                    return
                  }
                  if (selectOrder?.nextInKitchen > 0) {
                    dispatch({ type: 'SHOW_PAY_TYPE', payload: orderNumber })
                  }
                  else {
                    alert("Order not sent to kitchen yet")
                  }

                }} style={{ borderRadius: 0, width: 45, marginLeft: 4, height: 54, textAlignVertical: 'center', }}
                contentStyle={{ height: 54, }}
                labelStyle={{ textAlignVertical: 'center', fontWeight: '100', fontSize: 24 }}
                icon={'credit-card-outline'}
                textColor='black'></Button>
            </View>
            <View style={{ backgroundColor: 'black', width: StyleSheet.hairlineWidth, height: '50%' }} />
            <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center', }}>
              <Button
                onPress={() => {
                  setShowPrinter(true)
                }} style={{ borderRadius: 0, width: 45, marginLeft: 4, height: 54, textAlignVertical: 'center', }}
                contentStyle={{ height: 54, }}
                labelStyle={{ textAlignVertical: 'center', fontWeight: '100', fontSize: 24 }}
                icon={'cogs'}
                textColor='black'
                disabled={!isMaster && selectOrder?.user?._id != activeStuff?._id}
              />
            </View>
            <View style={{ backgroundColor: 'black', width: StyleSheet.hairlineWidth, height: '50%', }} />
            <View style={{ justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row', flexGrow: 1, }}>
              <Feather name={'dollar-sign'} size={20} color={(totalPayed >= total && total > 0 ? 'black' : 'red')} style={{}} />
              <Text style={{ fontSize: 20, fontWeight: '500', color: (totalPayed >= total && total > 0 ? 'black' : 'red') }}>{
                selectOrder?.
                  commandProduct?.
                  reduce((total, { product, addableIngredientsChoose, addableProductsChoose, clickCount, status, linkToFormula, addablePrice }) => {
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
                  }, 0)}</Text>
            </View>
          </View>
        </View>
      </View>

      <SelectItemToPrint
        setShowTransfer={setShowTransfer}
        showTransfer={showTransfer}
        indexes={indexes}
        setIndexes={setIndexes}
        dispatch={dispatch}
        Zone={zone}
        table={table}
        printer={printer}
        orders={orders}
        orderNumber={orderNumber}
        showPrinter={showPrinter}
        setShowPrinter={setShowPrinter}
        pointOfSale={pointOfSale}
        Command={command}
        selectOrder={selectOrder}
        user={user} />

      <ModalSelectTypeOfCommand

        selecteorderNumber={(a) => {
          setOrderNumber(a)
        }}
        control={control}
        orders={orders}
        pointOfSale={pointOfSale}
        block={block}
        setBlock={setBlock}
        currentRestaurant={pointOfSale?._id}
        Zone={zone}
        table={table}
        orderNumber={orderNumber}
        Command={command}
        Clear={() => {
          setValue('selectedProductsList', [])
          setOrderNumber(null)
        }}
        setCommand={setCommand}
        show={show}
        setShow={setShow}
        onChange={async (a) => {
          if (isLinked && !orderNumber) {
            alert('You are in mode connected, you cannot create command')
            return
          }
          setDispearTheButton(true)
          if (a?.commandProduct[0]?.product?.option?.filter(a => a?.required).length == 0 || a?.commandProduct[0]?.product?.isFormula) {
            dispatch(createOrder(JSON.parse(JSON.stringify({ order: { ...a, uniqueId: await getUniqueId(), }, currentRestaurant: pointOfSale?._id }))))
            setOrderNumber(a?.orderNumber)
          } else {
            setselectedProductWithOption({ product: a?.commandProduct[0]?.product })
            dispatch(createOrder(JSON.parse(JSON.stringify({ order: { ...a, commandProduct: [], uniqueId: await getUniqueId(), }, currentRestaurant: pointOfSale?._id }))))
            setOrderNumber(a?.orderNumber)
          }

        }}
      />

      <ModalCancelPremission />

      {visible &&
        <QuickViewModal

          visible={visible}
          setVisible={setVisible}
          order={selectOrder}
          onChange={(client) => {
            dispatch(addContactToOrder({ ...client, orderNumber }))
          }}
          pointOfSale={pointOfSale} />
      }

      <ModalNoteToKitchen orderNumber={orderNumber} currentNote={selectOrder?.note} />

      <ModalProfileViewer />

      <ModalKeyPadSelector table={table} setOrderNumber={setOrderNumber} orders={orders?.filter(e => {
        return e?.pointOfSale?._id == pointOfSale?._id

      })} activeStuff={activeStuff} />

      <MultipleProductModal show={showDouble} setShow={setShowDouble} onChange={DoubleProduct} />

      <ModalStuffPinPadSelector isMaster={isMaster} currentRestaurant={pointOfSale?._id} stuff={stuff} show={showPin} setShow={setShowPin} />

      <ModalOptionSelector
        formule={formule}
        currentService={currentService}
        setDispearTheButton={setDispearTheButton}
        product={selectedProductWithOption?.product}
        linkToFormula={selectedProductWithOption?.linkToFormula}
        unid={selectedProductWithOption?.unid}
        addablePrice={selectedProductWithOption?.addablePrice}
        clear={setselectedProductWithOption}
        orderNumber={orderNumber}
        ChooseOptions={ChooseOptions}
        setChooseOptions={setChooseOptions} />
    </View>
  )

};
export default ControlScreen;