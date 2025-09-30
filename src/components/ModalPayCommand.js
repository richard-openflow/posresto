import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/Styles';
import { TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import ThermalPrinterModule from 'react-native-thermal-printer';
import { getPayload } from '../utils/helpers';
import { closeOrder, payOrder } from '../redux/actions/orderActions';
let timer = null
const ModalPayCommand = ({ }) => {
  const [PayType, setPayType] = useState('creditCard');
  const [amount, setAmount] = useState(0);
  const [roomNumber, setRoomNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [offertBy, setOffertBy] = useState('');
  const [email, setEmail] = useState('');
  const [paymentType, setPaymentType] = useState('split');
  const [order, setOrder] = useState({});
  const [payedTotal, setPayedTotal] = useState(0);
  const [disableProduct, setDisableProduct] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [remise, setRemise] = useState(0);
  const [splitNubmnerActive, setNumberActive] = useState(1);
  const [totalToPay, setTotalToPay] = useState(0);
  const [accountAmountPaid, setAccountAmountPaid] = useState(0);
  const [paidHistory, setPaidHistory] = useState([]);
  const [orderLines, setOrderLines] = useState([]);
  const [splitNumber, setSplitNumber] = useState([1, 2, 3, 4, 5, 6, 7]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [PaidProduct, setPaidProduct] = useState([]);
  const { showPayTypeModal, orderNumber } = useSelector(state => state.Modal);
  //const Orders = useSQLQuery('Orders');
  const { orders } = useSelector(state => state.order)
  //const staff = useSQLQuery('User')?.filtered('pointOfSale._id == $0', currentRestaurant)
  const { stuff, activeStuff } = useSelector(state => state.stuff)
  // const activeStaff = staff?.filtered('active = true')[0] 
  const user = activeStuff
  useEffect(() => {
    if (orderNumber) {
      const item = orders?.find((e) => e?.orderNumber == orderNumber)

      const t = item?.commandProduct?.reduce(
        (total, { product, addableIngredientsChoose, addableProductsChoose, clickCount, status, linkToFormula, addablePrice }) => {

          if (status == 'cancel') return total;
          let subtotal = addableIngredientsChoose?.reduce((t, a) => {
            let aaa = a?.options.reduce((i, j) => i + j?.price * j?.quantity, 0)
            return t + aaa
          }, 0) || 0
          let subtotalproduct = addableProductsChoose?.reduce((t, a) => {
            let aaa = a?.options?.reduce((i, j) => i + j?.price * j?.quantity, 0)
            return t + aaa
          }, 0) || 0

          return total + (((linkToFormula ? addablePrice : product?.price) * clickCount) + subtotal + subtotalproduct);

        },
        0,
      );
      const shouldDisableProduct = item?.paidHistory?.some((e) => {
        return e.products.length == 0
      }) || false

      setDisableProduct(shouldDisableProduct)
      const p = item?.paidHistory?.reduce((total, { amount }) => {

        return total + amount;
      }, 0) || 0;
      setRemise(0)
      const account = item?.paidHistory?.reduce((total, { amount, payType, products }) => {
        if (payType == 'account')
          return total + amount;
        return total
      }, 0) || 0;

      const remise = item?.paidHistory?.reduce((total, { amount, payType, products }) => {
        setPaidProduct((e) => [...e, ...products])
        if (payType == 'remise')
          return total + amount;
        return total
      }, 0) || 0;
      setRemise(remise)
      setPaidHistory(item?.paidHistory || []);
      setOrderLines(
        item?.commandProduct?.filter(cp => {
          return !item?.paidHistory?.some(ph =>
            ph.products.some(p => '' + p === '' + cp._id),
          );
        }).filter(a => {
          return !(a?.linkToFormula && a.addablePrice == 0)
        }),
      );
      setOrder(item);
      setAccountAmountPaid(account);
      setPayedTotal(p || 0);
      setTotalToPay(t || 0);
      setAmount(paymentType === 'split' ? parseFloat(t - p) : 0);
    }
  }, [orderNumber, orders, refresh, showPayTypeModal]);

  useEffect(() => {
    if (paymentType === 'product') {
      setAmount(0);
    }
    setSelectedProducts([])
  }, [paymentType]);


  const dispatch = useDispatch();
  const { currentRestaurant: pointOfSale } = useSelector(state => state.user)
  // const currentRestaurant = new Realm.BSON.ObjectId(a)

  //const pointOfSale = useSQLQuery('PointOfSale').filtered('_id == $0', currentRestaurant)

  //const printer = useSQLQuery('Printer')?.filtered('pointOfSale._id == $0 && enbaled == true', currentRestaurant)
  const { printer } = useSelector(state => state.printer)
  return (
    <Modal statusBarTranslucent transparent visible={showPayTypeModal}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, height: 500 }}
      >
        <View
          style={{
            backgroundColor: '#00000099',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            height: 500,
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              padding: 15,
              paddingLeft: 30,
              borderRadius: 3,
              minWidth: 500,
              flex: 1,
              width: '100%'
            }}
          >
            <ScrollView contentContainerStyle={paymentType == 'split' ? { flexGrow: 1, gap: 15, } : { flexGrow: 1, gap: 15 }} >
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flexDirection: 'row', flexGrow: 1, gap: 15, alignItems: 'center' }}>

                  <TextInput
                    label={'Recu'}
                    disabled={paymentType === 'product'}
                    mode="outlined"
                    value={new String(amount).toString()}
                    onChangeText={txt => {
                      if (parseInt(txt) > 0) setAmount(parseFloat(txt));
                      else setAmount('');
                    }}
                    style={{ width: 150, fontSize: 30, }}
                    placeholder="How much they paid"
                    keyboardType="decimal-pad"
                  // textColor='red'
                  />
                  <TextInput
                    label={'PAID'}
                    mode="outlined"
                    disabled
                    value={new String(payedTotal - remise).toString()}
                    style={{ width: 150, fontSize: 30 }}
                    placeholder="How much they paid"
                    keyboardType="decimal-pad"
                  // textColor='red'
                  />
                  <TextInput
                    label={'LEFT'}
                    mode="outlined"
                    disabled
                    value={new String(totalToPay - payedTotal).toString()}
                    style={{ width: 150, fontSize: 30, }}
                    placeholder="How much they paid"
                    textColor='red'

                    keyboardType="decimal-pad"
                  />

                  <TextInput
                    label={'Total'}
                    mode="outlined"
                    disabled
                    value={new String(totalToPay).toString()}
                    style={{ width: 150, fontSize: 30 }}
                    placeholder="How much they paid"
                    keyboardType="decimal-pad"
                  // textColor='red'
                  />
                  <View style={{ flexGrow: 1 }} />
                  <View style={{ width: 200, height: 48, marginTop: 4, flexDirection: 'row', borderWidth: StyleSheet.hairlineWidth, borderColor: '#00000044', }}>
                    <TouchableHighlight onPress={() => { setPaymentType('split') }}>
                      <View style={{ width: 98, height: 47, justifyContent: 'center', alignItems: 'center', backgroundColor: paymentType == 'split' ? 'red' : 'white' }} >
                        <Text style={{ color: paymentType != 'split' ? 'black' : 'white' }}>Split</Text>
                      </View>
                    </TouchableHighlight>
                    <TouchableHighlight disabled={disableProduct} onPress={() => { setPaymentType('product') }}>
                      <View style={{ width: 98, height: 47, justifyContent: 'center', alignItems: 'center', backgroundColor: paymentType == 'product' ? 'red' : 'white', borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: '#00000044' }} >
                        <Text style={{ color: paymentType != 'product' ? 'black' : 'white', textDecorationLine: disableProduct ? 'line-through' : 'none' }}>Product</Text>
                      </View>
                    </TouchableHighlight>
                  </View>

                </View>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 30,
                    marginTop: 10,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}
                >
                  {(order?.paymentRequired && accountAmountPaid <= order?.payAmount) && <TouchableHighlight
                    underlayColor
                    style={{ borderRadius: 8 }}
                    onPress={() => {


                      setPayType('account');
                      setFirstName('')
                      setRoomNumber('')
                      setAmount(parseFloat((totalToPay > (order?.payAmount - accountAmountPaid || 0) ? (order?.payAmount - accountAmountPaid || 0) : totalToPay) || 0))

                    }}
                  >
                    <View
                      style={[
                        {
                          height: 80,
                          width: 90,
                          borderRadius: 8,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderWidth: StyleSheet.hairlineWidth
                        },
                        {
                          backgroundColor:
                            PayType == 'account' ? colors.primary : 'white',
                        },
                      ]}
                    >
                      <MaterialCommunityIcons
                        color={PayType == 'account' ? 'white' : 'black'}
                        name={'credit-card-outline'}
                        size={25}
                      />
                      <Text
                        style={{
                          color: PayType == 'account' ? 'white' : 'black',
                          fontSize: 18,
                        }}
                      >
                        Acompte
                      </Text>
                      <Text
                        style={{
                          color: PayType == 'account' ? 'white' : 'black',
                          fontSize: 14,
                        }}
                      >
                        {order?.payAmount - accountAmountPaid}
                      </Text>
                    </View>
                  </TouchableHighlight>}
                  {!(accountAmountPaid == 0 && order?.paymentRequired) &&
                    <>
                      <TouchableHighlight
                        underlayColor
                        style={{ borderRadius: 8 }}
                        onPress={() => {
                          setPayType('creditCard');
                          setFirstName('')
                          setRoomNumber('')
                        }}
                      >
                        <View
                          style={[
                            {
                              height: 80,
                              width: 90,
                              borderRadius: 8,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderWidth: StyleSheet.hairlineWidth
                            },
                            {
                              backgroundColor:
                                PayType == 'creditCard' ? colors.primary : 'white',
                            },
                          ]}
                        >
                          <MaterialCommunityIcons
                            color={PayType == 'creditCard' ? 'white' : 'black'}
                            name={'credit-card-outline'}
                            size={25}
                          />
                          <Text
                            style={{
                              color: PayType == 'creditCard' ? 'white' : 'black',
                              fontSize: 18,
                            }}
                          >
                            Card
                          </Text>
                          <Text
                            style={{
                              color: PayType == 'creditCard' ? 'white' : 'black',
                              fontSize: 14,
                            }}
                          >
                            {paidHistory?.reduce((a, b) => { return ((b?.payType == "creditCard") ? a + b?.amount : a) }, 0)}
                          </Text>
                        </View>
                      </TouchableHighlight>
                      <TouchableHighlight
                        underlayColor
                        style={{ borderRadius: 8 }}
                        onPress={() => {
                          setPayType('cash');
                          setFirstName('')
                          setRoomNumber('')
                        }}
                      >
                        <View
                          style={[
                            {
                              height: 80,
                              width: 90,
                              borderRadius: 8,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderWidth: StyleSheet.hairlineWidth
                            },
                            {
                              backgroundColor:
                                PayType == 'cash' ? colors.primary : 'white',
                            },
                          ]}
                        >
                          <FontAwesome5
                            color={PayType == 'cash' ? 'white' : 'black'}
                            name={'coins'}
                            size={25}
                          />
                          <Text
                            style={{
                              color: PayType == 'cash' ? 'white' : 'black',
                              fontSize: 18,
                            }}
                          >
                            Cash
                          </Text>
                          <Text
                            style={{
                              color: PayType == 'cash' ? 'white' : 'black',
                              fontSize: 14,
                            }}
                          >
                            {paidHistory?.reduce((a, b) => { return ((b?.payType == "cash") ? a + b?.amount : a) }, 0)}
                          </Text>
                        </View>
                      </TouchableHighlight>
                      <TouchableHighlight
                        underlayColor
                        style={{ borderRadius: 8 }}
                        onPress={() => {
                          setPayType('bank');
                          setFirstName('')
                          setRoomNumber('')
                        }}
                      >
                        <View
                          style={[
                            {
                              height: 80,
                              width: 90,
                              borderRadius: 8,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderWidth: StyleSheet.hairlineWidth
                            },
                            {
                              backgroundColor:
                                PayType == 'bank' ? colors.primary : 'white',
                            },
                          ]}
                        >
                          <MaterialCommunityIcons
                            color={PayType == 'bank' ? 'white' : 'black'}
                            name={'bank'}
                            size={25}
                          />
                          <Text
                            style={{
                              color: PayType == 'bank' ? 'white' : 'black',
                              fontSize: 18,
                            }}
                          >
                            Bank
                          </Text>
                          <Text
                            style={{
                              color: PayType == 'bank' ? 'white' : 'black',
                              fontSize: 14,
                            }}
                          >
                            {paidHistory?.reduce((a, b) => { return ((b?.payType == "bank") ? a + b?.amount : a) }, 0)}
                          </Text>
                        </View>
                      </TouchableHighlight>
                      <TouchableHighlight
                        underlayColor
                        style={{ borderRadius: 8 }}
                        onPress={() => {
                          setPayType('wire');
                          setFirstName('')
                          setRoomNumber('')
                        }}
                      >
                        <View
                          style={[
                            {
                              height: 80,
                              width: 90,
                              borderRadius: 8,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderWidth: StyleSheet.hairlineWidth
                            },
                            {
                              backgroundColor:
                                PayType == 'wire' ? colors.primary : 'white',
                            },
                          ]}
                        >
                          <FontAwesome5
                            color={PayType == 'wire' ? 'white' : 'black'}
                            name={'money-check-alt'}
                            size={25}
                          />
                          <Text
                            style={{
                              color: PayType == 'wire' ? 'white' : 'black',
                              fontSize: 18,
                            }}
                          >
                            Check
                          </Text>
                          <Text
                            style={{
                              color: PayType == 'wire' ? 'white' : 'black',
                              fontSize: 14,
                            }}
                          >
                            {paidHistory?.reduce((a, b) => { return ((b?.payType == "wire") ? a + b?.amount : a) }, 0)}
                          </Text>
                        </View>
                      </TouchableHighlight>
                      <TouchableHighlight
                        underlayColor
                        style={{ borderRadius: 8 }}
                        onPress={() => {
                          setPayType('room');
                          setFirstName('')
                          setRoomNumber('')
                        }}
                      >
                        <View
                          style={[
                            {
                              height: 80,
                              width: 90,
                              borderRadius: 8,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderWidth: StyleSheet.hairlineWidth
                            },
                            {
                              backgroundColor:
                                PayType == 'room' ? colors.primary : 'white',
                            },
                          ]}
                        >
                          <Fontisto
                            color={PayType == 'room' ? 'white' : 'black'}
                            name={'room'}
                            size={25}
                          />
                          <Text
                            style={{
                              color: PayType == 'room' ? 'white' : 'black',
                              fontSize: 18,
                            }}
                          >
                            Room
                          </Text>
                          <Text
                            style={{
                              color: PayType == 'room' ? 'white' : 'black',
                              fontSize: 14,
                            }}
                          >
                            {paidHistory?.reduce((a, b) => { return ((b?.payType == "room") ? a + b?.amount : a) }, 0)}
                          </Text>
                        </View>
                      </TouchableHighlight>
                      <TouchableHighlight
                        underlayColor
                        style={{ borderRadius: 8 }}
                        onPress={() => {
                          setPayType('credit');
                          setFirstName('')
                          setRoomNumber('')
                        }}
                      >
                        <View
                          style={[
                            {
                              height: 80,
                              width: 90,
                              borderRadius: 8,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderWidth: StyleSheet.hairlineWidth
                            },
                            {
                              backgroundColor:
                                PayType == 'credit' ? colors.primary : 'white',
                            },
                          ]}
                        >
                          <FontAwesome5
                            color={PayType == 'credit' ? 'white' : 'black'}
                            name={'hand-holding-usd'}
                            size={25}
                          />
                          <Text
                            style={{
                              color: PayType == 'credit' ? 'white' : 'black',
                              fontSize: 18,
                            }}
                          >
                            Credit
                          </Text>
                          <Text
                            style={{
                              color: PayType == 'credit' ? 'white' : 'black',
                              fontSize: 14,
                            }}
                          >
                            {paidHistory?.reduce((a, b) => { return ((b?.payType == "credit") ? a + b?.amount : a) }, 0)}
                          </Text>
                        </View>
                      </TouchableHighlight>
                      <TouchableHighlight
                        underlayColor
                        style={{ borderRadius: 8 }}
                        onPress={() => {
                          setPayType('offert');
                          setFirstName('')
                          setRoomNumber('')
                        }}
                      >
                        <View
                          style={[
                            {
                              height: 80,
                              width: 90,
                              borderRadius: 8,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderWidth: StyleSheet.hairlineWidth
                            },
                            {
                              backgroundColor:
                                PayType == 'offert' ? colors.primary : 'white',
                            },
                          ]}
                        >
                          <FontAwesome5
                            color={PayType == 'offert' ? 'white' : 'black'}
                            name={'info'}
                            size={25}
                          />
                          <Text
                            style={{
                              color: PayType == 'offert' ? 'white' : 'black',
                              fontSize: 18,
                            }}
                          >
                            Offert
                          </Text>
                          <Text
                            style={{
                              color: PayType == 'offert' ? 'white' : 'black',
                              fontSize: 14,
                            }}
                          >
                            {paidHistory?.reduce((a, b) => { return ((b?.payType == "offert") ? a + b?.amount : a) }, 0)}
                          </Text>
                        </View>
                      </TouchableHighlight>
                      <TouchableHighlight
                        underlayColor
                        style={{ borderRadius: 8 }}
                        onPress={() => {
                          setPayType('tips');
                          setFirstName('')
                          setRoomNumber('')
                        }}
                      >
                        <View
                          style={[
                            {
                              height: 80,
                              width: 90,
                              borderRadius: 8,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderWidth: StyleSheet.hairlineWidth
                            },
                            {
                              backgroundColor:
                                PayType == 'tips' ? colors.primary : 'white',
                            },
                          ]}
                        >
                          <Ionicons
                            color={PayType == 'tips' ? 'white' : 'black'}
                            name={'pricetag-outline'}
                            size={25}
                          />
                          <Text
                            style={{
                              color: PayType == 'tips' ? 'white' : 'black',
                              fontSize: 18,
                            }}
                          >
                            Voucher
                          </Text>
                          <Text
                            style={{
                              color: PayType == 'tips' ? 'white' : 'black',
                              fontSize: 14,
                            }}
                          >
                            {paidHistory?.reduce((a, b) => { return ((b?.payType == "tips") ? a + b?.amount : a) }, 0)}
                          </Text>
                        </View>
                      </TouchableHighlight>
                      <TouchableHighlight
                        underlayColor
                        style={{ borderRadius: 8 }}
                        onPress={() => {
                          setPayType('remise');
                          setFirstName('')
                          setRoomNumber('')
                        }}
                      >
                        <View
                          style={[
                            {
                              height: 80,
                              width: 90,
                              borderRadius: 8,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderWidth: StyleSheet.hairlineWidth
                            },
                            {
                              backgroundColor:
                                PayType == 'remise' ? colors.primary : 'white',
                            },
                          ]}
                        >
                          <MaterialCommunityIcons
                            color={PayType == 'remise' ? 'white' : 'black'}
                            name={'ticket-percent'}
                            size={25}
                          />
                          <Text
                            style={{
                              color: PayType == 'remise' ? 'white' : 'black',
                              fontSize: 18,
                            }}
                          >
                            Discount
                          </Text>
                          <Text
                            style={{
                              color: PayType == 'remise' ? 'white' : 'black',
                              fontSize: 14,
                            }}
                          >
                            {paidHistory?.reduce((a, b) => { return ((b?.payType == "remise") ? a + b?.amount : a) }, 0)}
                          </Text>
                        </View>
                      </TouchableHighlight>
                    </>}
                </View>
              </ScrollView>


              {paymentType === 'split' && (
                <>
                  <ScrollView horizontal contentContainerStyle={{ gap: 8 }}>
                    {[...splitNumber, '+'].map((e, index) => {
                      return (
                        <TouchableHighlight
                          key={index}
                          underlayColor
                          style={{ borderRadius: 5 }}
                          onPress={() => {

                            if (e != '+') {
                              const ttl = Math.ceil(
                                parseFloat(totalToPay - payedTotal) / parseInt(e),
                              );
                              setNumberActive(e);
                              setAmount(ttl > 0 ? ttl : 0);
                            } else {
                              setSplitNumber(f => [...f, ...Array.from(Array(10).keys()).map(a => a + f.length + 1)])
                            }
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
                                backgroundColor:
                                  splitNubmnerActive == e ? 'red' : 'white',
                                borderRadius: 3,
                              },

                            ]}
                          >
                            <Text
                              style={{
                                color:
                                  splitNubmnerActive == e ? 'white' : 'black',
                              }}
                            >
                              {e}
                            </Text>
                          </View>
                        </TouchableHighlight>
                      );
                    })}

                  </ScrollView>

                </>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: PayType == 'credit' ? 'space-between' : 'flex-start',
                  gap: PayType == 'credit' ? 0 : 10,
                  flexWrap: 'wrap',

                }}
              >
                {(PayType == 'room' || PayType == 'tips' || PayType == 'remise') && (
                  <TextInput
                    label={(PayType == 'tips' || PayType == 'remise') ? "reduction" : 'Room Number'}
                    mode="outlined"
                    value={new String(roomNumber).toString()}
                    onChangeText={txt => {
                      if (PayType == 'remise') {
                        setFirstName(new Number((txt * 100) / totalToPay).toFixed(2) + '')
                      }
                      setRoomNumber(txt);
                    }}
                    style={{ width: 250, fontSize: 24, }}
                    placeholder=""
                    keyboardType="decimal-pad"
                  />
                )}
                {['room', 'credit', 'tips', 'remise'].includes(PayType) && (
                  <TextInput
                    label={(PayType == 'tips' || PayType == 'remise') ? 'percentage' : 'First Name'}
                    mode="outlined"
                    value={new String(firstName).toString()}
                    onChangeText={txt => {
                      if (PayType == 'remise') {
                        setRoomNumber(new Number((txt * totalToPay) / 100).toFixed(2) + '')
                      }
                      setFirstName(txt);
                    }}
                    style={{ width: '24%', fontSize: 24, }}
                    placeholder=""
                  />
                )}
                {
                  PayType == 'remise' &&
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableHighlight
                      underlayColor
                      style={{ borderRadius: 5, marginTop: 5 }}
                      onPress={() => {


                        if (parseFloat(roomNumber) == 0 || isNaN(parseFloat(roomNumber))) {
                          alert('Please entre a valid Number')
                          return
                        }
                        dispatch(payOrder({
                          orderNumber,
                          _id: generateId(),
                          payType: PayType,
                          amount: parseFloat(roomNumber),
                          roomNumber,
                          firstName,
                          lastName,
                          phone,
                          email,
                          products: selectedProducts,
                          offertBy
                        }, () => {
                          setRefresh((e) => !e)
                        }))

                      }}
                    >
                      <View
                        style={[
                          {
                            width: 100,
                            height: 45,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderWidth: StyleSheet.hairlineWidth,
                            borderColor: 'black',
                          },
                          { backgroundColor: 'red', borderRadius: 3 },
                        ]}
                      >
                        <Text style={{ color: 'white', fontSize: 20 }}>APPLY</Text>
                      </View>
                    </TouchableHighlight>
                  </View>}
                {PayType == 'credit' && (
                  <TextInput
                    label={'Last Name'}
                    mode="outlined"
                    value={new String(lastName).toString()}
                    onChangeText={txt => {
                      setLastName(txt);
                    }}
                    style={{ width: '25%', fontSize: 24, }}
                    placeholder=""
                  />
                )}
                {PayType == 'credit' && (
                  <TextInput
                    label={'Email'}
                    mode="outlined"
                    value={new String(email).toString()}
                    onChangeText={txt => {
                      setEmail(txt);
                    }}
                    style={{ width: '25%', fontSize: 24, }}
                    placeholder=""
                  />
                )}
                {PayType == 'credit' && (
                  <TextInput
                    label={'Phone'}
                    mode="outlined"
                    value={new String(phone).toString()}
                    onChangeText={txt => {
                      setPhone(txt);
                    }}
                    style={{ width: '25%', fontSize: 24, }}
                    placeholder=""
                    keyboardType="decimal-pad"
                  />
                )}
                {PayType == 'offert' && (
                  <TextInput
                    label={'Offert Par'}
                    mode="outlined"
                    value={new String(offertBy).toString()}
                    onChangeText={txt => {
                      setOffertBy(txt);
                    }}
                    style={{ width: 250, fontSize: 24, }}
                    placeholder=""
                  />
                )}
              </View>
              {paymentType === 'product' && (
                <ScrollView contentContainerStyle={{}}>

                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {orderLines?.map((selectedProduct, index) => {
                      // console.log(JSON.stringify({ prd: selectedProduct?.product?.option?.filter((aw) => aw.productOptions.length > 0) }, '', '\t'))

                      const ph = order?.paidHistory.reduce((a, b) => [...a, ...b?.products], [])
                      const isPayed = ph.some(e => e?._id == selectedProduct?._id)

                      const isSelected = selectedProducts.some(p => {

                        return '' + p?._id === '' + selectedProduct?._id
                      }
                      );
                      if (isPayed) return null
                      return (
                        <TouchableOpacity
                          key={index}
                          disabled={isPayed}
                          onPress={() => {
                            if (isSelected) {
                              setSelectedProducts(
                                selectedProducts.filter(
                                  p => '' + p._id !== '' + selectedProduct._id,
                                ),
                              );
                              setAmount(
                                amount - selectedProduct?.product?.price,
                              );
                            } else {
                              setSelectedProducts([
                                ...selectedProducts,
                                selectedProduct,
                              ]);
                              setAmount(
                                amount + selectedProduct?.product?.price,
                              );
                            }
                          }}
                          delay={200}
                          style={[styles.item]}
                        >
                          <View
                            style={{
                              borderColor: '#00000022',
                              backgroundColor: !isSelected ? 'white' : 'black',
                              borderWidth: StyleSheet.hairlineWidth,
                              padding: 0,
                              justifyContent: 'center',
                              alignItems: 'center',
                              borderBottomColor: 'red',
                              borderBottomWidth: 2,
                            }}
                          >
                            <View
                              style={[
                                {
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'flex-start',
                                  height: 80,
                                  flex: 1,
                                  width: '100%',
                                  marginTop: 5,
                                },
                              ]}
                            >

                              <Text
                                numberOfLines={3}
                                ellipsizeMode="tail"
                                style={[
                                  styles.title,
                                  { color: !isSelected ? 'black' : 'white', },

                                ]}
                              >
                                {selectedProduct.product?.itemName}
                              </Text>
                              <Text
                                style={[
                                  styles.price,
                                  {
                                    fontSize: 16,
                                    textAlign: 'right',
                                    paddingRight: 5,
                                    alignSelf: 'flex-end',

                                    color: !isSelected ? 'black' : 'white',
                                  },
                                ]}
                              >
                                {selectedProduct?.linkToFormula ? selectedProduct?.addablePrice : selectedProduct?.product?.price}
                              </Text>
                            </View>

                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ScrollView>
              )}
              <View style={{ flexGrow: 15 }} />
              <View
                style={{

                  flexDirection: 'row-reverse',
                  gap: 5,
                  alignItems: 'flex-end',

                }}
              >
                {(amount < totalToPay && (totalToPay - payedTotal) > 0) && (
                  <TouchableHighlight
                    disabled={PayType == 'remise'}
                    underlayColor
                    style={{ borderRadius: 5, }}
                    onPress={() => {


                      if (
                        PayType === 'credit' &&
                        lastName === '' &&
                        firstName === '' &&
                        phone === '' &&
                        email === ''
                      ) {
                        alert('Please fill at least one field');
                      } else if (PayType === 'room' && roomNumber === '') {
                        alert('the room number is required');
                      } else {

                        dispatch(payOrder({
                          orderNumber,
                          _id: generateId(),
                          payType: PayType,
                          amount,
                          roomNumber,
                          firstName,
                          lastName,
                          phone,
                          email,
                          products: selectedProducts,
                          offertBy
                        }, (a) => {

                          const t = a?.commandProduct?.reduce(
                            (total, { product, addableIngredientsChoose, clickCount, status, linkToFormula, addablePrice }) => {

                              if (status == 'cancel') return total;
                              let subtotal = addableIngredientsChoose?.reduce((t, a) => {
                                let aaa = a?.options.reduce((i, j) => i + j?.price * j?.quantity, 0)
                                return t + aaa
                              }, 0) || 0

                              return total + (((linkToFormula ? addablePrice : product?.price) * clickCount) + subtotal);
                              //return total + product.price * clickCount;
                            },
                            0,
                          );
                          const p = a?.paidHistory?.reduce((total, { amount }) => {

                            return total + amount;
                          }, 0) || 0;

                          if (t == p || paymentType == 'product') {

                            printer?.map((e) => {
                              if (!e?.main) {
                                return null
                              }
                              if (!e?.enbaled) {
                                return null
                              }
                              let payload = false
                              try {
                                payload = getPayload({ pointOfSale, user, orders, orderNumber: order?.orderNumber, indexes: paymentType != 'product' ? [] : a?.commandProduct?.map((e, index) => selectedProducts.some(ee => ee?._id == e?._id) ? index : null), dublicata: false })
                              } catch (error) {
                                alert('There was an error while creating ticket')
                              }
                              if (timer) {
                                alert('please try again in 5 seconds')
                                return
                              }
                              timer = setTimeout(() => {
                                timer = null
                                ThermalPrinterModule?.printTcp({
                                  ip: e?.ipAdress,
                                  port: e?.port,
                                  autoCut: e?.autoCut,
                                  openCashbox: e?.openCashbox,
                                  printerNbrCharactersPerLine: e?.printerNbrCharactersPerLine,
                                  payload,
                                  timeout: 3000
                                }).catch((err) => {
                                  alert(`Impossible de se connecter a l'imprimante : (${e.name})`)
                                })
                              }, 200);
                            })


                          }
                          setRefresh((e) => !e)
                        }))
                        setSelectedProducts([]);
                        setOffertBy("")
                      }
                    }}
                  >
                    <View
                      style={[
                        {
                          width: 100,
                          height: 70,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderWidth: StyleSheet.hairlineWidth,
                          borderColor: 'black',
                        },
                        { backgroundColor: PayType == 'remise' ? 'gray' : 'red', borderRadius: 3 },
                      ]}
                    >
                      <Text style={{ color: 'white', fontSize: 20 }}>NEXT</Text>
                    </View>
                  </TouchableHighlight>
                )}

                {(amount == totalToPay && (totalToPay - payedTotal) > 0) && (
                  <TouchableHighlight
                    underlayColor
                    disabled={PayType == 'remise'}
                    style={{ borderRadius: 5 }}
                    onPress={() => {
                      if (
                        PayType === 'credit' &&
                        lastName === '' &&
                        firstName === '' &&
                        phone === '' &&
                        email === ''
                      ) {
                        alert('Please fill at least one field');
                      } else if (PayType === 'room' && roomNumber === '') {
                        alert('the room number is required');
                      } else {
                        dispatch({
                          type: 'HIDE_PAY_TYPE',
                        });
                        dispatch(payOrder({
                          orderNumber,
                          _id: generateId(),
                          payType: PayType,
                          amount,
                          roomNumber,
                          firstName,
                          lastName,
                          phone,
                          email,
                          products: selectedProducts,
                          offertBy
                        }, () => {
                          setRefresh((e) => !e)
                        }))
                        setSelectedProducts([]);
                        setPaymentType('split');

                        printer?.map((e) => {
                          if (!e?.main) {
                            return null
                          }
                          if (!e?.enbaled) {
                            return null
                          }
                          setTimeout(() => {
                            try {
                              const payload = getPayload({ pointOfSale, user, orders, orderNumber: order?.orderNumber, indexes: selectedProducts?.map((e) => e?._id), dublicata: false })
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
                            } catch (error) {

                            }
                          }, 1);
                        })
                      }
                    }

                    }

                  >
                    <View
                      style={[
                        {
                          width: 100,
                          height: 70,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderWidth: StyleSheet.hairlineWidth,
                          borderColor: 'black',
                        },
                        { backgroundColor: PayType == 'remise' ? 'gray' : 'red', borderRadius: 3 },
                      ]}
                    >
                      <Text style={{ color: 'white', fontSize: 20 }}>VALID</Text>
                    </View>
                  </TouchableHighlight>
                )}



                <TouchableHighlight
                  disabled={PayType == 'remise'}
                  underlayColor
                  style={{ borderRadius: 5 }}
                  onPress={() => {

                    setPaymentType('split');
                    dispatch({
                      type: 'HIDE_PAY_TYPE',
                    });
                  }}
                >
                  <View
                    style={[
                      {
                        width: 100,
                        height: 70,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: StyleSheet.hairlineWidth,
                        borderColor: 'black',
                      },
                      { backgroundColor: PayType == 'remise' ? 'gray' : 'red', borderRadius: 3 },
                    ]}
                  >
                    <Text style={{ color: 'white', fontSize: 20 }}>CLOSE</Text>
                  </View>
                </TouchableHighlight>
                {order?.commandProduct?.length == order?.paidHistory?.length &&
                  order?.paidHistory?.length == 0 &&
                  <TouchableHighlight
                    disabled={PayType == 'remise'}
                    underlayColor
                    style={{ borderRadius: 5 }}
                    onPress={() => {
                      dispatch(closeOrder(order?._id))
                    }}
                  >
                    <View
                      style={[
                        {
                          width: 150,
                          height: 70,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderWidth: StyleSheet.hairlineWidth,
                          borderColor: 'black',
                        },
                        { backgroundColor: 'red', borderRadius: 3 },
                      ]}
                    >
                      <Text style={{ color: 'white', fontSize: 20 }}>Close table</Text>
                    </View>
                  </TouchableHighlight>}

              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView >
    </Modal >
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    width: 150,
    margin: 2,
  },
  title: {
    fontSize: 14,
    marginBottom: 10,
    flexGrow: 1,
    maxWidth: 100,
    paddingLeft: 5,
  },
  price: {
    fontSize: 10,

    zIndex: 1500,
    color: 'black',
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  itemImage: {
    flexGrow: 1,
    height: 110,
    width: 110,
    marginHorizontal: 5,
    marginVertical: 1,
  },
});

export { ModalPayCommand };
