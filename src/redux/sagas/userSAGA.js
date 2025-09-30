import { API } from "@utils"
import { all, call, fork, put, takeEvery } from 'redux-saga/effects'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { confirmaccess, confirmaccessByToken, deinedaccess } from '../actions/userActions'
import { ASKFORACCESS, ASKFORACCESSBYTOKEN, GETCONTACTBYPHONE } from '../constants/UserActionsType'

function* fetchUser(action) {
    try {
        const response = yield call(API.post, "/auth", { ...action?.payload?.data })


        const { user, token, restaurants, firstRestaurant, device } = response

        yield call(AsyncStorage.setItem, 'db_device_id', device?._id)
        yield call(AsyncStorage.setItem, 'ROLE', user?.role + '')
        yield put(confirmaccess(user, token, restaurants, firstRestaurant))
    } catch (e) {

        action?.payload?.callback(e?.response?.data?.codeError)
        yield put(deinedaccess(e.message))

    }
}

function* fetchUserBytoken(action) {
    try {
        const { user, restaurants } = yield call(API.post, "/access-by-token",)
        yield put(confirmaccessByToken(user, restaurants))
    } catch (e) {
        yield put(deinedaccess(e.message))

    }
}

function* fetchContactByPhone(action) {
    try {
        const data = yield call(API.post, "/orders/client-orders", { ...action?.payload })

        action?.payload?.callback(data)

    } catch (e) {

        console.log('===>>', JSON.stringify(e, '', '\t'))
    }
}


function* fetchUserSAGA() {
    yield takeEvery(ASKFORACCESS, fetchUser)
}



function* fetchUserBytokenSAGA() {
    yield takeEvery(ASKFORACCESSBYTOKEN, fetchUserBytoken)
}


function* fetchContactByPhoneSAGA() {
    yield takeEvery(GETCONTACTBYPHONE, fetchContactByPhone)
}



function* userSaga() {
    yield all([
        fork(fetchUserSAGA),
        fork(fetchUserBytokenSAGA),
        fork(fetchContactByPhoneSAGA),

    ])
}


export default userSaga