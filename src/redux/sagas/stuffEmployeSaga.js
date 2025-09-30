import { API } from "@utils"
import { all, call, fork, put, takeEvery } from 'redux-saga/effects'
import { UserController } from '../../utils/sqliteDB'
import { setEmployeeStuffFailed, setEmployeeStuffSuccess } from '../actions/StuffEmployeeAction'
import { GET_EMPLOYEE_STUFF } from '../constants/StuffEmployeeActionTypes'

function* fetchStuff(action) {
    try {
        const res = yield call(API.post, "/users/staff/all", { pointOfSaleId: action?.payload?.pointOfSaleId })
        const employe = []

        for (const a of res) {
            const emp = yield call(UserController.create, a, action?.payload?.pointOfSaleId)
            employe.push(emp)
        }
        yield put(setEmployeeStuffSuccess(JSON.parse(JSON.stringify(employe))))
    } catch (error) {

        yield put(setEmployeeStuffFailed(error))


    }
 
}

function* fetchStuffSaga() {
    yield takeEvery(GET_EMPLOYEE_STUFF, fetchStuff)
}

function* StuffEmployeeSaga() {
    yield all([
        fork(fetchStuffSaga)
    ])
}

export default StuffEmployeeSaga