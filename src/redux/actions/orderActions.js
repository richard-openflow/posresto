
import { UPDATE_UNIT_ORDER, ORDER_BEEN_SAVED, CHANGE_ORDER_CLASSIFYING_PRODUCT, CREATE_COMMAND, GETORDER, GETORDERFAILED, GETORDERSUCCESS, ADD_PRODUCT_TO_ORDER, UPDATE_ORDER, SEND_ALL_TO_KITCHEN, PAY_ORDER, CLEAR_ORDERS, TRANSFER_ORDERS, CANCEL_PRODUCT_IN_ORDER, ADD_NOTE_TO_ORDER, SETUNIQUEIDOFDEVICE, RE_SEND_ALL_TO_KITCHEN, ADD_CONTACT_TO_ORDER, ADD_CONTACT_TO_ORDER_SUCCESS, ADD_CONTACT_TO_ORDER_FAILED, DELETE_ORDER, TRANSFER_PRODUCT_TO_ORDER, BOOKING_ORDER_CREATION, GET_BOOKING_INFORMATION_TO_ORDER, GET_BOOKING_INFORMATION_TO_ORDER_FAILED, GET_BOOKING_INFORMATION_TO_ORDER_SUCCESS, CLOSE_ORDER, GET_ALL_BOOKING_OF_DAY, GET_ALL_BOOKING_OF_DAY_FAILED, GET_ALL_BOOKING_OF_DAY_SUCCESS, ORDER_BEEN_SYNCED } from "../constants/orderActionsTypes"
import { store } from "../store"




export const getOrders = (data) => ({
    type: GETORDER,
    payload: data
})
export const getOrderSuccess = (data) => ({
    type: GETORDERSUCCESS,
    payload: data
})
export const getOrderFailed = (data) => ({
    type: GETORDERFAILED,
    payload: data
})

export const setUniqueIdOfDevice = (data) => ({
    type: SETUNIQUEIDOFDEVICE,
    payload: data
})

export const createOrder = (data) => {
    let WifiConnect = store.getState().WifiConnect
    return ({
        type: CREATE_COMMAND,
        payload: { ...data, order: { ...data.order, wasConnectedOnCreation: WifiConnect?.WifiConnected || false } },

    })
}
export const AddProductToOrder = (data, callback = () => { }) => {

    return ({
        type: ADD_PRODUCT_TO_ORDER,
        payload: { data, callback },

    })
}
export const updateOrder = (data) => {

    return ({
        type: UPDATE_ORDER,
        payload: data,

    })
}
export const deleteOrder = (data) => {

    return ({
        type: DELETE_ORDER,
        payload: data,

    })
}

export const sendAllToKitchen = (data) => {

    return ({
        type: SEND_ALL_TO_KITCHEN,
        payload: data,

    })
}
export const reSendAllToKitchen = (data) => {

    return ({
        type: RE_SEND_ALL_TO_KITCHEN,
        payload: data,

    })
}
export const payOrder = (data, callback = () => { }) => {

    return ({
        type: PAY_ORDER,
        payload: data,
        callback
    })
}

export const clearOrders = () => {
    return ({
        type: CLEAR_ORDERS,

    })
}


export const transferOrders = (data) => {
    return ({
        type: TRANSFER_ORDERS,
        payload: data

    })
}
export const cancelProductInOrder = (data) => {
    return ({
        type: CANCEL_PRODUCT_IN_ORDER,
        payload: data

    })
}

export const addNoteToOrder = (data) => {
    return ({
        type: ADD_NOTE_TO_ORDER,
        payload: data

    })
}
export const addContactToOrder = (data) => {
    return ({
        type: ADD_CONTACT_TO_ORDER,
        payload: data

    })
}
export const addContactToOrderSuccess = (data) => {
    return ({
        type: ADD_CONTACT_TO_ORDER_SUCCESS,
        payload: data

    })
}
export const addContactToOrderFailed = (data) => {
    return ({
        type: ADD_CONTACT_TO_ORDER_FAILED,
        payload: data

    })
}
export const transferProductToOrder = (data) => {
    return ({
        type: TRANSFER_PRODUCT_TO_ORDER,
        payload: data

    })
}

export const changeOrderClassifyingProduct = (data) => {
    return ({
        type: CHANGE_ORDER_CLASSIFYING_PRODUCT,
        payload: data

    })
}
export const bookingOrderCreation = (data) => {
    return ({
        type: BOOKING_ORDER_CREATION,
        payload: data
    })
}


export const updateUnitOrder = (data) => {
    return ({
        type: UPDATE_UNIT_ORDER,
        payload: data
    })
}


export const getBookingInformationToOrder = (data) => {
    return ({
        type: GET_BOOKING_INFORMATION_TO_ORDER,
        payload: data
    })
}
export const getBookingInformationToOrderSuccess = (data) => {
    return ({
        type: GET_BOOKING_INFORMATION_TO_ORDER_SUCCESS,
        payload: data
    })
}

export const getBookingInformationToOrderFailed = (data) => {
    return ({
        type: GET_BOOKING_INFORMATION_TO_ORDER_FAILED,
        payload: data
    })
}
export const closeOrder = (data) => {
    return ({
        type: CLOSE_ORDER,
        payload: data
    })
}
export const getAllBookingOfDay = (data) => {
    return ({
        type: GET_ALL_BOOKING_OF_DAY,
        payload: data
    })
}
export const getAllBookingOfDaySuccess = (data) => {
    return ({
        type: GET_ALL_BOOKING_OF_DAY_SUCCESS,
        payload: data
    })
}
export const getAllBookingOfDayFailed = (data) => {
    return ({
        type: GET_ALL_BOOKING_OF_DAY_FAILED,
        payload: data
    })
}
export const orderBeenSynced = (data) => {
    return ({
        type: ORDER_BEEN_SYNCED,
        payload: data
    })
}
export const orderHasBeenSaved = (data) => {
    return ({
        type: ORDER_BEEN_SAVED,
        payload: data
    })
}
