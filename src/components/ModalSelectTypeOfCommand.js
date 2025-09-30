import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { BSON } from 'realm';
import { colors } from '../theme/Styles';
import { CommandController } from '../utils/realmDB/service/commandService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ModalSelectTypeOfCommand = ({
  block = true,
  setBlock = () => { },
  Command = {},
  show = false,
  setShow = () => { },
  // products,
  control,
  onChange = () => { },
  Clear = () => { },
  currentRestaurant,
  pointOfSale,
  Zone,
  table,
  orderNumber,
  orders,
  selecteorderNumber = () => { }
}) => {
  const [cmd, setCmd] = useState({ ...Command, type: 'onsite' });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedCmd, setSelectedCmd] = useState([]);
  const [peopleNumber, setPeopleNumber] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [zones, setZones] = useState([]);
  const [ords, setOrders] = useState([]);
  const [hide, setHide] = useState(true);
  const [realTime, setRealTime] = useState(false);
  const [numberPeople, setNumberPeople] = useState(0);
  const products = useWatch({ control, name: 'selectedProductsList' })
  //const orderNumber = useWatch({ control, name: 'orderNumber' })
  const { activeStuff } = useSelector(state => state.stuff)
  const { isLinked } = useSelector(state => state.user)

  useEffect(() => {
    // console.log(JSON.stringify(orders, '', '\t'))
    if (!((products?.length == 1 && hide && !orderNumber) || show)) {
      setBlock(false);
      CommandController.getUnPaidCommmand(
        {
          orders,
          pointOfSaleId: pointOfSale?._id,
          dt: moment().format('YYYY/MM/DD'),
        }
      )?.then(e => {

        setOrders(e);
      });
    }
  }, [
    products?.length,
    hide,
    orderNumber,
    show,
    block,
    orders
  ]);

  useEffect(() => {
    // if (block) 
    setTimeout(() => {
      setCmd(e => {
        return {
          ...e,
          type: 'onsite',
          orderNumber: moment().valueOf(),
          nextInKitchen: 0,
          pointOfSale,
          user: activeStuff,
          zone: zones[0],
          _id: new BSON.ObjectId(),

          origin: 'pos',
          commandProduct: products?.map((e) => {

            return {
              ...e,
              addOnDate: new Date(),
              clickCount: e.clickCount,
              dateZ: null,
              sent: 0,
              orderClassifying: 1,
              paid: false,
              status: "new",
              unid: products[0]?.product?.unid,
            }
          }),
          unit: null
          // unit: table
          //   ?.sort((a, b) => a?.unitNumber - b?.unitNumber)
          //   ?.filter(a => a?.localization == zones[0]?.nameSlug)[0],
        };
      });
    }, 500);

  }, [block, (products?.length == 1 && hide && !orderNumber) || show]);

  useEffect(() => {
    setZones(Zone);
  }, [table]);

  useEffect(() => {
    if (products?.length == 0) setHide(true);
  }, [products]);

  useEffect(() => {
    setCmd({ ...Command });
  }, [Command, orderNumber]);

  useEffect(() => {
    if (!((products?.length == 1 && hide && !orderNumber) || show)) {
      setCmd({});
      (async () => {
        const rltm = await AsyncStorage.getItem('realTimeOrder')

        setRealTime(rltm == 'true')
      })()
    }
  }, [(products?.length == 1 && hide && !orderNumber) || show])

  return (
    <Modal
      statusBarTranslucent
      transparent
      visible={
        (
          products?.length == 1 &&
          hide &&
          !orderNumber
        ) || show


      }
    >
      <View
        style={{
          backgroundColor: '#00000099',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            padding: 15,
            paddingLeft: 30,
            borderRadius: 3,
            minHeight: '95%',
            minWidth: '80%',
            width: '95%',
          }}
        >
          <View style={{ flexDirection: 'row-reverse' }}>
            <TouchableHighlight
              underlayColor
              onPress={() => {
                Clear(), setShow(false), setHide(false); setNumberPeople(0)
              }}
            >
              <View
                style={{
                  borderWidth: 1,
                  height: 50,
                  width: 50,
                  padding: 5,
                  borderColor: 'red',
                  borderRadius: 4,
                }}
              >
                <EvilIcons name={'close'} size={40} color={'red'} />
              </View>
            </TouchableHighlight>
          </View>

          {!block && (
            <View
              style={{
                flexDirection: 'row',
                gap: 30,
                marginTop: 10,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                marginBottom: 20,
              }}
            >
              <TouchableHighlight
                underlayColor
                style={{ borderRadius: 8 }}
                onPress={() => {
                  setCmd(e => {
                    if (e?.type == 'counter') {
                      onChange({ ...cmd, numberPeople, realTime }), setShow(false), setHide(false); setNumberPeople(0)
                      return e;
                    } else return {
                      ...e, type: 'counter',
                      orderNumber: moment().valueOf(),
                      nextInKitchen: 0,
                      pointOfSale,
                      user: activeStuff,
                      origin: 'pos',

                      commandProduct: products?.map((e) => {

                        return {
                          ...e,
                          addOnDate: new Date(),
                          clickCount: e.clickCount,
                          dateZ: null,
                          sent: 0,
                          orderClassifying: 1,
                          paid: false,
                          status: "new",
                          unid: products[0]?.product?.unid,
                        }
                      }),
                      _id: new BSON.ObjectId()
                    };
                  });
                }}
              >
                <View
                  style={[
                    {
                      borderWidth: StyleSheet.hairlineWidth,
                      borderColor: '#00000099',
                      height: 100,
                      width: 90,
                      borderRadius: 8,
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                    {
                      backgroundColor: cmd.type == 'counter' ? colors.primary : 'white',
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    color={cmd.type == 'counter' ? 'white' : 'black'}
                    name={'cash-register'}
                    size={50}
                  />
                  <Text
                    style={{ color: cmd.type == 'counter' ? 'white' : 'black' }}
                  >
                    Counter
                  </Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor
                style={{ borderRadius: 8 }}
                onPress={() =>
                  setCmd(e => {
                    return {
                      ...e, type: 'onsite',
                      orderNumber: moment().valueOf(),
                      nextInKitchen: 0,
                      pointOfSale,
                      user: activeStuff,
                      origin: 'pos',

                      commandProduct: products?.map((e) => {
                        return {
                          ...e,
                          addOnDate: new Date(),
                          clickCount: e.clickCount,
                          dateZ: null,
                          sent: 0,
                          orderClassifying: 1,
                          paid: false,
                          status: "new",
                          unid: products[0]?.product?.unid,
                        }
                      }),
                      _id: new BSON.ObjectId()

                    };
                  })
                }
              >
                <View
                  style={[
                    {
                      borderWidth: StyleSheet.hairlineWidth,
                      borderColor: '#00000099',
                      height: 100,
                      width: 90,
                      borderRadius: 8,
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                    {
                      backgroundColor:
                        cmd.type == 'onsite' ? colors.primary : 'white',
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    color={cmd.type == 'onsite' ? 'white' : 'black'}
                    name={'chair-school'}
                    size={50}
                  />
                  <Text
                    style={{ color: cmd.type == 'onsite' ? 'white' : 'black' }}
                  >
                    On-site
                  </Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor
                style={{ borderRadius: 8 }}
                onPress={() =>
                  setCmd(e => {

                    if (e?.type == 'collect') {
                      onChange({ ...cmd, numberPeople, realTime }), setShow(false), setHide(false); setNumberPeople(0)

                      return e;
                    } else return {
                      ...e, type: 'collect',
                      orderNumber: moment().valueOf(),
                      nextInKitchen: 0,
                      pointOfSale,

                      user: activeStuff,
                      origin: 'pos',

                      commandProduct: products?.map((e) => {
                        return {
                          ...e,
                          addOnDate: new Date(),
                          clickCount: e.clickCount,
                          dateZ: null,
                          sent: 0,
                          orderClassifying: 1,
                          paid: false,
                          status: "new",
                          unid: products[0]?.product?.unid,
                        }
                      }),
                      _id: new BSON.ObjectId()
                    };
                  })
                }
              >
                <View
                  style={[
                    {
                      borderWidth: StyleSheet.hairlineWidth,
                      borderColor: '#00000099',
                      height: 100,
                      width: 90,
                      borderRadius: 8,
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                    {
                      backgroundColor:
                        cmd.type == 'collect' ? colors.primary : 'white',
                    },
                  ]}
                >
                  <Fontisto
                    color={cmd.type == 'collect' ? 'white' : 'black'}
                    name={'shopping-bag-1'}
                    size={50}
                  />
                  <Text
                    style={{ color: cmd.type == 'collect' ? 'white' : 'black' }}
                  >
                    Collect
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
          )}
          {cmd?.type == 'onsite' && (
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
                                ef?.nameSlug == cmd?.zone?.nameSlug
                                  ? 'white'
                                  : 'black',
                            }}
                          >
                            {ef?.name}
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
                      const theBooking = ords

                        ?.filter((s) => {
                          return s?.type == "onsite"
                        })
                        ?.filter((s) => {
                          const total = s?.commandProduct?.reduce((total, { product, clickCount, status }) => {
                            if (status == 'cancel')
                              return total
                            return total + product.price * clickCount;
                          }, 0)

                          const totalPayed = s?.paidHistory?.reduce((total, { amount }) => {
                            return total + amount;
                          }, 0)

                          return !(totalPayed >= total && s?.commandProduct.length > 0)
                        })
                      const hasBooking = theBooking?.some(e => e?.unit?._id + '' == ef?._id + '');
                      const booking = theBooking?.find(e => e?.unit?._id + '' == ef?._id + '') || null;
                      if (hasBooking)
                        console.log(JSON.stringify(booking, '', '\t'))

                      return (
                        <TouchableHighlight
                          disabled={isLinked && !hasBooking}
                          underlayColor
                          style={{
                            borderRadius: 5,
                            backgroundColor: 'blue',
                            width: 80,
                            height: 50,
                          }}
                          onPress={() => {
                            setSelectedBooking(booking)

                            if (booking) {
                              setNumberPeople(booking.numberPeople)
                            } else
                              setNumberPeople(0)


                            if (hasBooking) {
                              setSelectedCmd(theBooking)
                              setCmd(e => { return { ...e, unit: ef } })
                            } else {
                              setSelectedCmd([])
                              setCmd(e => {
                                return { ...e, unit: ef };
                              });
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
                                backgroundColor: hasBooking
                                  ? 'orange'
                                  : ef?._id + '' == cmd?.unit?._id + ''
                                    ? colors.primary
                                    : isLinked ? '#ccc' : 'white',
                                borderRadius: 3,
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
          )}
          <Text>Number of People</Text>
          <ScrollView horizontal contentContainerStyle={{ gap: 5 }}>
            {[...peopleNumber, '+'].map((e) => {
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
                    if (e != '+')
                      setNumberPeople(e);
                    else {
                      setPeopleNumber(e => [...e, ...Array.from(Array(10).keys()).map(a => a + e.length + 1)])
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
                        backgroundColor: numberPeople + '' == e + ''
                          ? colors.primary
                          : 'white',
                        borderRadius: 3,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color:
                          numberPeople + '' == e + ''
                            ? 'white'
                            : 'black',
                        fontSize: 20,
                      }}
                    >
                      {e}
                    </Text>
                  </View>
                </TouchableHighlight>
              )
            })}
          </ScrollView >
          <View />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: 5,
              gap: 5,
            }}
          >
            {cmd.type == 'onsite' && (
              <TouchableHighlight
                underlayColor
                style={{ borderRadius: 5 }}
                onPress={() => {

                  if (selectedBooking) {
                    selecteorderNumber(selectedBooking?.orderNumber)
                    setShow(false);
                    setHide(false);
                    setNumberPeople(0)
                    return
                  }

                  if (!cmd?.unit) {
                    alert("please select a table")
                    return
                  }

                  if (numberPeople == 0) {
                    alert("please select number of people")
                    return
                  }

                  if (selectedCmd?.length == 0) {
                    onChange({ ...cmd, numberPeople, realTime });
                  } else {
                    selecteorderNumber(selectedCmd[0]?.orderNumber)
                  }
                  setShow(false);
                  setHide(false);
                  setNumberPeople(0)
                }}
              >
                <View
                  style={[
                    {
                      width: 100,
                      height: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: StyleSheet.hairlineWidth,
                      borderColor: 'black',
                    },
                    { backgroundColor: 'red', borderRadius: 3 },
                  ]}
                >
                  <Text style={{ color: 'white', fontSize: 20 }}>Valid</Text>
                </View>
              </TouchableHighlight>
            )}
          </View>
        </View>
      </View>
    </Modal >
  );
};
export { ModalSelectTypeOfCommand };

