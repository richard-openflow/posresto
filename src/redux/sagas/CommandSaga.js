import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '@utils';
import BackgroundFetch from 'react-native-background-fetch';
import DeviceInfo from 'react-native-device-info';
import { all, call, fork, put, select, takeEvery } from 'redux-saga/effects';
import TinyEmitter from 'tiny-emitter/instance';
import { getSocket } from '../../utils/socket';
import { getCommandFailed, getCommandSuccess } from '../actions/CommandeActions';
import { GETCOMMAND } from '../constants/CommandeActionTypes';
import { BOOKING_ORDER_CREATION, CLEAR_ORDERS, CREATE_COMMAND, DELETE_ORDER, GET_ALL_BOOKING_OF_DAY, GET_BOOKING_INFORMATION_TO_ORDER, PAY_ORDER, RE_SEND_ALL_TO_KITCHEN, SEND_ALL_TO_KITCHEN, TRANSFER_ORDERS, TRANSFER_PRODUCT_TO_ORDER } from '../constants/orderActionsTypes';
import { CommandController } from '../../utils/realmDB/service/commandService';
import { getOrderObject } from '../../utils/helpers';
import { bookingOrderCreation, createOrder, getBookingInformationToOrderFailed, getBookingInformationToOrderSuccess, updateUnitOrder } from '../actions/orderActions';
import { showModalActionTableMap } from '../actions/ModalReducer';

const backgroundProccess = () => {
  BackgroundFetch.scheduleTask({
    taskId: "OPENFLOW",
    forceAlarmManager: true,
    delay: 100  // <-- milliseconds
  });
}

function* fetchCommand(action) {
  try {
    const res = yield call(API.post, '/orders', {
      restaurantId: action?.payload?.restaurantId || '629f392f297a647b71389af5',
      // restaurantId: '629f392f297a647b71389af5',
      orderDate: action.payload, // // ...action.payload
      // orderDate : "2023-05-08"
    });
    yield put(getCommandSuccess(res.orders));
  } catch (error) {
    yield put(getCommandFailed(error));
  }
}
function* getbookingInformationtoOrderFn(action) {
  try {

    const { currentRestaurant: pointOfSale } = yield select(state => state.user)
    const { booking } = yield call(API.post, "/booking/is-units-booked", JSON.parse(JSON.stringify({ pointOfSaleId: pointOfSale?._id, time: new Date()?.getTime() - (new Date().getTimezoneOffset() * 60 * 1000), units: [action.payload] })))
    if (booking?.length && booking?.length > 0 && booking[0]?.isBooked && booking[0]?.isBooked.length > 0) {
      yield put(getBookingInformationToOrderSuccess(booking[0]?.isBooked[0]))
      yield put(showModalActionTableMap(action.payload))
    } else {
      yield put(showModalActionTableMap(action.payload))
      yield put(getBookingInformationToOrderFailed({}))
    }

  } catch (error) {
    yield put(getBookingInformationToOrderFailed(error))
  }
}

function* syncData() {
  try {
    // const { orders } = yield select(state => state.order)
    // const { currentRestaurant: pointOfSale } = yield select(state => state.user)
    // const id = yield call(DeviceInfo.getDeviceId);
    // const uid = yield call(DeviceInfo.getUniqueId);

    // for (const order of orders.filter(a => uid == a.uniqueId)) {
    //  // TinyEmitter.emit('DO_YOU_HAVE_THIS_COMMAND', { data: { o: order, id }, _id: pointOfSale?._id })
    // }
    /// const data = yield CommandController.findUnsentCommand()
    // const IP = yield NetworkInfo.getIPV4Address()
    // for (const ord of data) {
    //   sendToEveryOne({ event: 'SYNC_DATA', payload: { ord, IP }, })
    // }
  } catch (error) {
    console.log({ r_e_r: error })
  }
}

function* createCommand(action) {
  try {
    const { order, disableSocket = false, sendToServer = false } = action?.payload
    const { pointOfSale } = order
    const id = yield call(DeviceInfo.getDeviceId);
    const internetType = yield call(AsyncStorage.getItem, 'internetType')
    const realTimeOrder = yield call(AsyncStorage.getItem, 'realTimeOrder')
    const master = yield call(AsyncStorage.getItem, 'MasterDevices')

    if (sendToServer && master == 'true' && order?.eventType == 'sendToKitchen' && order.origin == 'pos' && realTimeOrder == 'true') {

      yield call(API.post, "/orders/pos-create-order", JSON.parse(JSON.stringify({ ord: { ...order, pointOfSale }, Z: null })))
    }
    if (!disableSocket) {
      if (internetType == 'true' || internetType == null || master == 'true')
        getSocket().emit(`local-new-order`, { data: { o: order, id }, _id: pointOfSale?._id })

      TinyEmitter.emit('SENDDATA', { data: { o: { ...order, eventType: 'createCommand' }, id, }, _id: pointOfSale?._id })
    }

  } catch (error) {
    console.error(error)
  } finally {

  }
}

function* sendToKitchenCommand(action) {
  try {
    const internetType = yield call(AsyncStorage.getItem, 'internetType') || "true"

    const orders = yield select(state => state.order)
    const { currentRestaurant: pointOfSale } = yield select(state => state.user)
    const order = orders?.orders?.find((e) => e?.orderNumber == action?.payload?.orderNumber)
    const id = yield call(DeviceInfo.getDeviceId);
    const master = yield call(AsyncStorage.getItem, 'MasterDevices')

    const realTimeOrder = yield call(AsyncStorage.getItem, 'realTimeOrder')
    if (master == 'true' && order.origin == 'pos' && realTimeOrder == 'true')
      yield call(API.post, "/orders/pos-create-order", JSON.parse(JSON.stringify({ ord: { ...order, pointOfSale }, Z: null })))

    if (internetType == 'true' || internetType == null)
      getSocket().emit(`local-new-order`, { data: { o: order, id }, _id: pointOfSale?._id })

    TinyEmitter.emit('SENDDATA', { data: { o: { ...order, eventType: 'createCommand' }, id, }, _id: pointOfSale?._id })
  } catch (error) {
    console.log({ sagaerror: error })
  } finally {
    backgroundProccess()
  }
}

function* deleteCommand(action) {
  try {
    //const internetType = yield call(AsyncStorage.getItem, 'internetType') || "true"

    const orders = yield select(state => state.order)
    const { currentRestaurant: pointOfSale } = yield select(state => state.user)

    yield call(CommandController.deleteOrders, orders?.orders || [], pointOfSale?._id, action?.payload)
    // const { currentRestaurant: pointOfSale } = yield select(state => state.user)
    // const order = orders?.orders?.find((e) => e?.orderNumber == action?.payload?.orderNumber)
    // const id = yield call(DeviceInfo.getDeviceId);
    // const master = yield call(AsyncStorage.getItem, 'MasterDevices')

    // const realTimeOrder = yield call(AsyncStorage.getItem, 'realTimeOrder')
    // if (master == 'true' && order.origin == 'pos' && realTimeOrder == 'true')
    //   yield call(API.post, "/orders/pos-create-order", JSON.parse(JSON.stringify({ ord: { ...order, pointOfSale }, Z: null })))

    // if (internetType == 'true' || internetType == null)
    //   getSocket().emit(`local-new-order`, { data: { o: order, id }, _id: pointOfSale?._id })

    // TinyEmitter.emit('SENDDATA', { data: { o: { ...order, eventType: 'sendToKitchen' }, id, }, _id: pointOfSale?._id })
  } catch (error) {
    console.log({ sagaerrordeleteCommand: error })
  } finally {
    backgroundProccess()
  }
}

function* payCommand(action) {
  try {
    const orders = yield select(state => state.order)
    const { currentRestaurant: pointOfSale, isLinked } = yield select(state => state.user)
    const order = orders?.orders?.find((e) => e?.orderNumber == action?.payload?.orderNumber)

    const internetType = yield call(AsyncStorage.getItem, 'internetType') || "true"

    const id = yield call(DeviceInfo.getDeviceId);
    const master = yield call(AsyncStorage.getItem, 'MasterDevices')
    const realTimeOrder = yield call(AsyncStorage.getItem, 'realTimeOrder')

    if (master == 'true' && order.origin == 'pos' && realTimeOrder == 'true')
      yield call(API.post, "/orders/pos-create-order", JSON.parse(JSON.stringify({ ord: { ...order, pointOfSale }, Z: order?.Z?._id })))

    if (internetType == 'true' || internetType == null)
      getSocket().emit(`local-new-order`, { data: { o: order, id }, _id: pointOfSale?._id })

    TinyEmitter.emit('SENDDATA', { data: { o: order, id }, _id: pointOfSale?._id })
    let total = 0
    if (order?.bookingId) {
      const totalPayed = order?.paidHistory?.reduce((total, { amount }) => {
        return total + amount;
      }, 0)

      if (totalPayed >= 0) {
        total = order?.commandProduct?.reduce((total, { product, linkToFormula, addablePrice, clickCount, status, addableProductsChoose, addableIngredientsChoose }) => {
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
      }

      if (totalPayed >= total && isLinked) {
        yield call(API.post, "/booking/set-status", JSON.parse(JSON.stringify({
          id: order?.bookingId,
          status: "check-out",
          pointOfSaleId: pointOfSale._id,
          date: new Date().getTime()
        })))

      }

    }


  } catch (error) {

  } finally {
    backgroundProccess()
  }
}

function* transferOrder(action) {
  try {

    const { orders } = yield select(state => state.order)
    const { currentRestaurant: pointOfSale } = yield select(state => state.user)
    const o = orders.find((a) => a.orderNumber == action.payload.orderNumber)
    const a = orders.find((a) => a.orderNumber == action.payload.newOrder.orderNumber)
    const id = yield call(DeviceInfo.getDeviceId);



    TinyEmitter.emit('SENDDATA', { data: { o: a, id }, _id: pointOfSale?._id })
    TinyEmitter.emit('SENDDATA', { data: { o: o, id }, _id: pointOfSale?._id })



  } catch (error) {
    console.log(error)
  } finally {
    backgroundProccess()
  }
}

function* clearData(action) {
  try {

    const master = yield call(AsyncStorage.getItem, 'MasterDevices')

    if (master == 'true')
      TinyEmitter.emit('SENDDATA', { event: "CLEARORDERS" })


    //TinyEmitter.emit('SENDDATA', { data: { o: order, id }, _id: pointOfSale?._id })

  } catch (error) {
    console.log(error)
  } finally {
    backgroundProccess()
  }
}

function* getBookingOfTheDay(action) {
  try {

    const { currentRestaurant: pointOfSale, isLinked } = yield select(state => state.user)

    if (isLinked) {
      const { booking } = yield call(API.post, "/booking/get-booking-of-all-day", JSON.parse(JSON.stringify({
        pointOfSaleId: action.payload,
        time: new Date(new Date().setHours(0, 0, 0, 0)).getTime()

      })))
      for (const a of booking) {
        if (a.status == 'check-in')
          yield put(bookingOrderCreation(a))
      }
    }



  } catch (error) {
    console.log(error)
  } finally {

  }
}

function* bookingOrderCreationFn(action) {
  try {
    const { currentRestaurant: pointOfSale, isLinked } = yield select(state => state.user)
    if (isLinked) {
      const { table } = yield select(state => state.table)
      const { stuff } = yield select(state => state.stuff)
      const { orders } = yield select(state => state.order)
      const order = orders?.find(a => a.bookingId == action?.payload?._id)
      const user = stuff.find(a => a?._id == action?.payload?.createdByUser || a?._id == action?.payload?.createdByUser?._id)

      if (pointOfSale) {
        if (action?.payload?.units?.length > 0) {
          const unit = table.find(i => action?.payload?.units.some(f => f?._id == i?._id || f == i?._id))
          if (!order) {
            const a = yield call(getOrderObject, { type: 'onsite', user, unit })
            yield put(createOrder(JSON.parse(JSON.stringify({
              order: {
                ...a,
                paymentRequired: action?.payload.requirePayment,
                payStatus: action?.payload.payZonePayment?.status || null,
                payAmount: action?.payload.paymentAmount || 0,
                pointOfSale, bookingId: action?.payload?._id,
                numberPeople: action?.payload?.nbrPeople,

                ...(typeof action?.payload?.customer == 'object' ? {
                  firstName: action?.payload?.customer?.firstName,
                  lastName: action?.payload?.customer?.lastName,
                  email: action?.payload?.customer?.email,
                  phone: action?.payload?.customer?.phone,
                }
                  :
                  {
                    firstName: action?.payload?.information?.firstName,
                    lastName: action?.payload?.information?.lastName,
                    email: action?.payload?.information?.email,
                    phone: action?.payload?.information?.phone,
                  })
              },
              currentRestaurant: pointOfSale?._id
            }))))
          } else {
            yield put(updateUnitOrder({ _id: order?._id, unit }))

          }
        }
      }
      else {

        const a = yield call(getOrderObject, { type: 'onsite', user: action?.payload?.createdByUser, unit: action?.payload?.units[0], pointOfSale: action?.payload?.pointOfSale })
        console.log({ a })
      }
    }
  } catch (error) {
    console.error(error)
  } finally {
    backgroundProccess()
  }

}

function* fetchCommandSaga() {
  yield takeEvery(GETCOMMAND, fetchCommand);
}

function* SyncDataSaga() {
  yield takeEvery('SYNC_DATA', syncData);
}

function* createCommandSaga() {
  yield takeEvery(CREATE_COMMAND, createCommand);
}

function* sendKitchenToKitchenSAGA() {
  yield takeEvery(SEND_ALL_TO_KITCHEN, sendToKitchenCommand);
}

function* reSendKitchenToKitchenSAGA() {
  yield takeEvery(RE_SEND_ALL_TO_KITCHEN, sendToKitchenCommand);
}

function* deleteOrderSAGA() {
  yield takeEvery(DELETE_ORDER, deleteCommand);
}

function* payOrderSAGA() {
  yield takeEvery(PAY_ORDER, payCommand);
}

function* transferOrderSaga() {
  yield takeEvery(TRANSFER_ORDERS, transferOrder);
}
function* transferProdctToOrderSaga() {
  yield takeEvery(TRANSFER_PRODUCT_TO_ORDER, transferOrder);
}
function* clearOrdersSaga() {
  yield takeEvery(CLEAR_ORDERS, clearData);
}
function* bookingOrderCreationSaga() {
  yield takeEvery(BOOKING_ORDER_CREATION, bookingOrderCreationFn);
}

function* getbookingInformationtoOrderSaga() {
  yield takeEvery(GET_BOOKING_INFORMATION_TO_ORDER, getbookingInformationtoOrderFn);
}
function* getBookingOfTheDaySaga() {
  yield takeEvery(GET_ALL_BOOKING_OF_DAY, getBookingOfTheDay);
}

function* commandSaga() {
  yield all([
    fork(fetchCommandSaga),
    fork(SyncDataSaga),
    fork(createCommandSaga),
    fork(sendKitchenToKitchenSAGA),
    fork(payOrderSAGA),
    fork(transferOrderSaga),
    fork(reSendKitchenToKitchenSAGA),
    fork(deleteOrderSAGA),
    fork(transferProdctToOrderSaga),
    fork(clearOrdersSaga),
    fork(bookingOrderCreationSaga),
    fork(getbookingInformationtoOrderSaga),
    fork(getBookingOfTheDaySaga),
  ]);
}

export default commandSaga;
