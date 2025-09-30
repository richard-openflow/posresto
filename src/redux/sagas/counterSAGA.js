import { API } from "@utils"
import { all, call, put, takeEvery } from 'redux-saga/effects'
import { AddFailedAction, AddSuccessAction } from '../actions/CounterActions'
import { ADD } from '../constants/counterActionTypes'

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
function* fetchUser(action) {
    try {

        const user = yield call(API.post, "/auth", {...action.payload})
        yield put(AddSuccessAction(user))
    } catch (e) {
        yield put(AddFailedAction(e.message))
    }
}


function* fetchUserSAGA() {
    yield takeEvery(ADD, fetchUser)
}


function* CounterSaga() {
    yield all([
       // fork(fetchUserSAGA)
    ])
}


export default CounterSaga