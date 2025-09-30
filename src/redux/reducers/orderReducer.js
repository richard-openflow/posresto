import { BSON } from "realm";
import {
  ADD_CONTACT_TO_ORDER,
  ADD_NOTE_TO_ORDER,
  ADD_PRODUCT_TO_ORDER,
  CANCEL_PRODUCT_IN_ORDER,
  CLEAR_ORDERS,
  CREATE_COMMAND,
  GETORDER,
  GETORDERFAILED,
  GETORDERSUCCESS,
  PAY_ORDER,
  RE_SEND_ALL_TO_KITCHEN,
  SEND_ALL_TO_KITCHEN,
  SETUNIQUEIDOFDEVICE,
  TRANSFER_ORDERS,
  DELETE_ORDER,
  UPDATE_ORDER,
  TRANSFER_PRODUCT_TO_ORDER,
  CHANGE_ORDER_CLASSIFYING_PRODUCT,
  UPDATE_UNIT_ORDER,
  GET_BOOKING_INFORMATION_TO_ORDER,
  GET_BOOKING_INFORMATION_TO_ORDER_SUCCESS,
  GET_BOOKING_INFORMATION_TO_ORDER_FAILED,
  CLOSE_ORDER,
  ORDER_BEEN_SYNCED,
  ORDER_BEEN_SAVED
} from "../constants/orderActionsTypes";
import TinyEmiter from 'tiny-emitter/instance'


const initialState = {
  orders: [],
  selectOrder: {},
  orderNumber: {},
  uniqueId: '',
  isLoading: false,
  isFetchLoading: false,
  error: null,
  tempoBooking: {}
};
let order
let product
export default OrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case GETORDER:
      return { ...state, isLoading: true };

    case GETORDERSUCCESS:
      return { ...state, isLoading: false, orders: action.payload };
    case GETORDERFAILED:
      return { ...state, isLoading: false, error: action.payload };

    case CREATE_COMMAND:


      if (state?.orders.some((o) => o?.orderNumber == action?.payload?.order?.orderNumber || o?._id == action?.payload?.order?._id)) {

        if (action.payload?.order?.commandProduct.length == 0) {

          return {
            ...state, isLoading: false, orders: [...state.orders.filter((o) => o?.orderNumber !== action?.payload?.order?.orderNumber && o?._id != action?.payload?.order?._id),
            { ...action?.payload?.order, saved: false, commandProduct: Array.from({ length: action?.payload?.order?.commandProduct[0]?.clickCount || 0 }, () => ({ ...action.payload?.order?.commandProduct[0] })) }
              // action.payload?.order
            ]
          }
        } else {

          return {
            ...state, isLoading: false, orders: [...state.orders.filter((o) => o?.orderNumber !== action?.payload?.order?.orderNumber && o?._id != action?.payload?.order?._id),
            // { ...action?.payload?.order, commandProduct: Array.from({ length: action?.payload?.order?.commandProduct[0]?.clickCount || 0 }, () => ({ ...action.payload?.order?.commandProduct[0] })) }
            { ...action.payload?.order, saved: false, }
            ]
          }
        }

      } else {

        return {
          ...state,
          isLoading: false,
          orders: [...state.orders,
          {
            ...action?.payload?.order,
            commandProduct: Array.from({ length: action?.payload?.order?.commandProduct[0]?.clickCount || 0 }, () => ({ ...action.payload?.order?.commandProduct[0] })) || [],
            paidHistory: [],
            saved: false,
            createdAt: new Date().getTime()
          }

          ]
        };
      }


    case ADD_PRODUCT_TO_ORDER:

      order = state?.orders.find((e) => e?.orderNumber == action?.payload?.data?.orderNumber)
      product = order?.commandProduct.find(fff => fff?._id + '' == '' + action?.payload?.data?._id)

      if (order) {
        if (!product) {
          order.saved = false;
          order.commandProduct = [...(order?.commandProduct || []),
          ...Array.from({ length: action?.payload?.data?.clickCount || 0 }, () => ({
            ... {
              _id: new BSON.ObjectID(),
              addOnDate: new Date(),
              clickCount: 1,
              dateZ: null,
              sent: 0,
              // orderClassifying: 1,
              paid: false,
              status: "new",
              linkToFormula: action?.payload?.data?.linkToFormula,
              addablePrice: action?.payload?.data?.addablePrice,
              unid: action?.payload?.data?.unid,
              product: action?.payload?.data?.product,
              conditionsChoose: action?.payload?.data?.conditionsChoose || [],
              addableIngredientsChoose: action?.payload?.data?.addableIngredientsChoose || [],
              addableProductsChoose: action?.payload?.data?.addableProductsChoose || [],
              removableIngredientsChoose: action?.payload?.data?.removableIngredientsChoose || [],
              note: action?.payload?.data?.note || '',

            }
          }))

          ]

          order.commandProduct = order.commandProduct.map(e => {
            let cp = e

            if (!cp?.orderClassifying) {
              cp.sent = order?.nextInKitchen

              if (action?.payload?.data?.currentService) {

                if (action?.payload?.data?.currentService > order?.nextInKitchen) {
                  cp.orderClassifying = action?.payload?.data?.currentService
                } else {
                  cp.orderClassifying = action?.payload?.data?.currentService + 0.5
                }
              } else {
                cp.orderClassifying = order?.nextInKitchen == 5 ? 5 : parseInt(order?.nextInKitchen + 1)
              }
              console.log(JSON.stringify(cp, '', '\t'))
            } else {


            }
            return cp
          })

          let starting = 0
          order.commandProduct = order.commandProduct.sort((a, b) => a.orderClassifying - b.orderClassifying)
          order.commandProduct = order.commandProduct.map((a) => {
            if (a.orderClassifying < 0)
              starting = Math.abs(a.orderClassifying)
            if (a.orderClassifying > 0 && a?.orderClassifying >= starting && starting > 0) {
              return { ...a, orderClassifying: a?.orderClassifying + 1 }

            }

            return { ...a, }
          })
          order.commandProduct = order.commandProduct.map((a) => { return { ...a, orderClassifying: Math.abs(a.orderClassifying) } })
          order.commandProduct = order.commandProduct.sort((a, b) => a.orderClassifying - b.orderClassifying)


        } else {
          product.conditionsChoose = action?.payload?.data?.conditionsChoose || []
          product.addableIngredientsChoose = action?.payload?.data?.addableIngredientsChoose || []
          product.addableProductsChoose = action?.payload?.data?.addableProductsChoose || []
          product.removableIngredientsChoose = action?.payload?.data?.removableIngredientsChoose || []
          product.note = action?.payload?.data?.note || ''
        }
      } else {
        action?.payload.callback()
      }
      return { ...state }

    case GETORDERFAILED:
      return { ...state, isLoading: false, error: null };

    case RE_SEND_ALL_TO_KITCHEN:

      return { ...state };

    case SEND_ALL_TO_KITCHEN:

      let cc = state?.orders.find((o) => o.orderNumber == action?.payload?.orderNumber)

      if (cc?.commandProduct.every(e => e.orderClassifying % 1 == 0)) {
        cc.commandProduct = cc?.commandProduct?.map((a) => {
          a.sent = a?.orderClassifying <= a.sent ? a.sent : a.sent + 1
          return a
        })

        cc.startSent = true;
        cc.saved = false;
        cc.nextInKitchen += 1
      } else {
        cc.commandProduct = cc?.commandProduct?.map((a) => {
          a.orderClassifying = parseInt(a?.orderClassifying)
          return a
        })
      }
      return { ...state };

    case DELETE_ORDER:

      return { ...state, orders: state?.orders.filter((o) => o.orderNumber != action?.payload) }

    case UPDATE_ORDER:

      order = state?.orders.find((o) => o.orderNumber == action?.payload?.orderNumber)
      order.saved = false
      if (action?.payload.type == 'delete') {


        if (action?.payload?.p?.product?.isFormula) {

          order.commandProduct = order?.commandProduct.filter(i => {

            return i.unid !== action?.payload?.p?.unid
          })
        } else {
          order.commandProduct = order?.commandProduct.filter(i => i._id + '' !== action?.payload?.p?._id + '')
        }
      } else if (action?.payload.type == 'unit') {

        delete action.payload.type
        order.unit = action?.payload?.unit
        order.zone = action?.payload?.zone
      } else {
        let f = order?.commandProduct?.find((e) => e?._id == action?.payload?.p?._id)
        if (action?.payload.type == 'orderClassifying')
          f.orderClassifying = action?.payload?.value
        else if (action?.payload.type == 'status') {
          let status = 'done'
          if (f.status == 'new') {
            status = "inprogress"
          } else if (f.status == 'inprogress') {
            status = "awaiting"
          } else if (f.status == 'awaiting')
            status = "done"
          else if (f.status == 'cancel')
            status = "cancel"
          f.status = status

          if (!action?.payload?.turnOn)
            TinyEmiter.emit('SENDDATA', { ...action.payload, status, event: 'statusChanging' })
        }
      }
      return { ...state }
    case PAY_ORDER:
      order = state?.orders.find((o) => o.orderNumber == action?.payload?.orderNumber)
      //console.log('aaaa', JSON.stringify({ order }, '', '\t'))
      order.saved = false
      order.paidHistory = order?.paidHistory?.map((e) => {
        if (e._id + '' == '' + action?.payload?.cancelled)
          return { ...e, cancelled: action?.payload?._id }
        return e
      })
      order.paidHistory = [...(order?.paidHistory || []), { ...action?.payload, cancelled: undefined }]
      action?.callback(order)
      return { ...state }
    case ADD_CONTACT_TO_ORDER:

      order = state?.orders.find((o) => o.orderNumber == action?.payload?.orderNumber)
      order.saved = false
      order.phone = action?.payload?.phone
      order.email = action?.payload?.email
      order.firstName = action?.payload?.firstName
      order.lastName = action?.payload?.lastName
      order.addresse = action?.payload?.addresse
      order.Ice = action?.payload?.Ice
      order.Company = action?.payload?.Company

      return { ...state }
    case ORDER_BEEN_SYNCED:
      order = state?.orders.find((o) => o._id == action?.payload)
      order.sync = true
      return { ...state }
    case ORDER_BEEN_SAVED:
      order = state?.orders.find((o) => o._id == action?.payload)
      order.saved = true
      return { ...state }


    case TRANSFER_ORDERS:

      const orderSender = state?.orders.filter((e) => e?.user?._id == new Realm.BSON.ObjectID(action?.payload?.sender?._id) && e?.pointOfSale?._id == new Realm.BSON.ObjectID(action?.payload?.pointOfSale?._id))
      orderSender.map((e) => {
        e.user = action?.payload?.receiver
      })
      orderSender.saved = false

      return { ...state }
    case CLEAR_ORDERS:
      return { ...state, orders: [], }

    case TRANSFER_PRODUCT_TO_ORDER:

      order = state?.orders.find(a => a.orderNumber == action?.payload?.orderNumber)
      order.saved = false
      const a = { ...state?.orders.find(a => a.orderNumber == action?.payload?.orderNumber) }

      if (action.payload.order) {
        const ba = state.orders.find(a => a.orderNumber == action?.payload?.order?.orderNumber)
        ba.commandProduct = [...ba?.commandProduct,
        ...(order.commandProduct.filter((_, index) => action?.payload?.indexes?.includes(index)).map(b => { return { ...b, orderClassifying: undefined } }))
        ]

        ba.commandProduct = ba.commandProduct.map(e => {
          let cp = e

          if (!cp?.orderClassifying) {
            cp.sent = ba?.nextInKitchen
            cp.orderClassifying = ba?.nextInKitchen //ba?.nextInKitchen == 5 ? 5 : parseInt(ba?.nextInKitchen + 1)
          }
          return cp
        })

      } else {
        state.orders = [...state.orders, {
          ...action.payload.newOrder, commandProduct: a.commandProduct.filter((_, index) => action?.payload?.indexes?.includes(index)).map(b => {
            return { ...b, orderClassifying: undefined }
          })?.map(e => {
            let cp = e

            if (!cp?.orderClassifying) {
              cp.sent = action.payload.newOrder?.nextInKitchen
              cp.orderClassifying = action.payload.newOrder?.nextInKitchen //== 5 ? 5 : parseInt(a?.nextInKitchen + 1)
            }
            return cp
          })
        }]


      }
      order.commandProduct = order.commandProduct.filter((_, index) => !action?.payload?.indexes?.includes(index))

      return { ...state, }

    case SETUNIQUEIDOFDEVICE:

      return { ...state, uniqueId: action.payload }

    case ADD_NOTE_TO_ORDER:
      order = state?.orders.find((o) => o.orderNumber == action?.payload?.orderNumber + '')
      order.note = action.payload.note
      order.saved = false
      return { ...state }

    case CANCEL_PRODUCT_IN_ORDER://todo cancel product in formula
      order = state?.orders.find((e) => e.commandProduct.some((f) => f._id == action?.payload))
      product = order.commandProduct.find(e => e?._id == action?.payload)
      order.saved = false
      if (product?.product.isFormula) {

        order.commandProduct = order?.commandProduct?.map((a) => {
          let p = a
          if (a.unid == product?.unid) {
            if (order?.nextInKitchen >= a?.orderClassifying) {
              p.status = 'cancel'
              return p
            } else
              return null
          } else
            return a
        })?.filter(a => a != null)
      }

      product.status = 'cancel'
      return { ...state }

    case CHANGE_ORDER_CLASSIFYING_PRODUCT:
      order = state?.orders.find((e) => e.commandProduct.some((f) => f._id == action?.payload._id))
      order.saved = false
      product = order.commandProduct.find(e => e?._id == action?.payload._id)
      product.orderClassifying = action.payload.orderClassifying > 0 ? action.payload.orderClassifying : 1
      order.commandProduct = order.commandProduct.sort((a, b) => a.orderClassifying - b.orderClassifying)
      return { ...state }

    case UPDATE_UNIT_ORDER:
      order = state?.orders.find((e) => e._id == action?.payload._id)
      order.saved = false
      order.unit = action?.payload.unit
      return { ...state }

    case GET_BOOKING_INFORMATION_TO_ORDER:
      return { ...state, isFetchLoading: true, tempoBooking: {} }

    case GET_BOOKING_INFORMATION_TO_ORDER_SUCCESS:
      return { ...state, isFetchLoading: false, tempoBooking: action.payload }

    case GET_BOOKING_INFORMATION_TO_ORDER_FAILED:
      return { ...state, isFetchLoading: false, tempoBooking: {} }

    case CLOSE_ORDER:

      state.orders = state?.orders.filter((e) => e._id != action?.payload)
      return { ...state, }

    default:
      return { ...state };
  }
} 