import { API } from "@utils"
import { all, call, fork, put, takeEvery } from 'redux-saga/effects'
import { getDevicesFailed, getDevicesSuccess } from '../actions/DevicesActions'
import { GETDEVICES } from '../constants/DevicesTypes'

function* fetchDevices(action) {
    try {
        const res = yield call(API.post, "/devices/get-all-devices", { pointOfSaleId: action?.payload?.pointOfSaleId })

        yield put(getDevicesSuccess(JSON.parse(JSON.stringify(res.device))))
    } catch (error) {

        yield put(getDevicesFailed(error))

    }

}

function* fetchDevicesSaga() {
    yield takeEvery(GETDEVICES, fetchDevices)
}

function* DeviceSaga() {
    yield all([
        fork(fetchDevicesSaga)
    ])
}

export default DeviceSaga