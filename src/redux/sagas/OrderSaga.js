import { API } from "@utils"
import { all, call, fork, put, select, takeEvery } from 'redux-saga/effects'
import { GETORDER } from "../constants/orderActionsTypes"
import { createOrder } from "../actions/orderActions"
import moment from "moment"

function* fetchOrder(action) {
    try {
        const { currentRestaurant } = yield select(state => state.user)
        const startOfDay = moment().startOf("day")
        const endOfDay = moment().startOf("end")
        const data = yield call(API.post, '/orders/get-unfinished-order-list', {
            "pointOfSaleId": currentRestaurant?._id,
            "dateRange": {
                "start": startOfDay,
                "end": endOfDay,
                "date": {
                    "date01": startOfDay,
                    "date02": endOfDay
                }
            }
        })
        const { menu } = yield select(state => state.menu)

        for (let i = 0; i < data?.orders.length; i++) {
            const order = data?.orders[i];

            let a = {
                _id: order._id,
                orderNumber: order?.orderNumber || new Date().getTime() + '',
                nextInKitchen: 0,
                numberPeople: 1,
            }

            if (order?.typeOrder == 'on_spot') {

                a.type = 'onsite';
                a.unit = order?.unit
                a.zone = a?.unit?.localization
            } else if (order?.typeOrder === "click_collect") {
                a.type = 'collect';
            } else {
                a.type = 'online';
            }
            // a.paidHistory = order.payments.map(x => {
            //     return {
            //         _id: x?._id,
            //         payType: x?.paymentMethod,
            //         firstName: x?.information?.firstName,
            //         roomNumber: x?.information?.roomNumber,
            //         amount: x?.amount,

            //     }
            // })
            a.commandProduct = []
            for (const o of order?.orderLines) {
                for (let i = 0; i < o.quantity; i++) {
                    let product = menu?.flatMap(e =>
                        e?.CategoryMenu?.flatMap(cat =>
                            cat?.products || []
                        ) || []
                    )?.find(b => b?.product?._id === o?.product)?.product;


                    a.commandProduct = [...a.commandProduct, {
                        clickCount: 1,
                        product,
                        sent: 0,
                        orderClassifying: 1,
                        status: "new",
                    }]

                }
            }
            if (a?.orderOrigin && a?.orderOrigin == "POS")
                yield put(createOrder(JSON.parse(JSON.stringify({ order: { ...a, origin: a?.orderOrigin, pointOfSale: currentRestaurant } }))))
        }

    } catch (error) {

        console.error(error)

    }

}

function* getOrderSaga() {
    yield takeEvery(GETORDER, fetchOrder)
}


function* OrderSaga() {
    yield all([
        fork(getOrderSaga)
    ])
}


export default OrderSaga