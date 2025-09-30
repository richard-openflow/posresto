import { API } from "@utils"
import { all, call, fork, takeEvery } from 'redux-saga/effects'
import { SETTOKEN } from '../constants/tokenActionType'


function* fetchToken(action) {
        const {token} = yield call(API.post, {...action.payload})
      
       // yield put(settoken(token))
}


function* fetchTokenSAGA() {
    yield takeEvery(SETTOKEN, fetchToken)
}



function*tokenSaga() {
    yield all([
        fork(fetchTokenSAGA)
    ])
}


export default tokenSaga