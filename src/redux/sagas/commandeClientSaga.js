import { API } from "@utils"
import { all, call, fork, put, takeEvery } from 'redux-saga/effects'
import { commandFailed, commandSent } from "../actions/commandeClientAction"
import { SENDCOMMAND } from "../constants/commandeClientActionType"

function* fetchcommandeClient(action) {
    try {
        const res = yield call(API.post, '/orders/create', action.payload)


        yield put(commandSent(res.commandClient))
    } catch (error) {

        yield put(commandFailed(error))

    }

}

function* fetchcommandeClientSaga() {
    yield takeEvery(SENDCOMMAND, fetchcommandeClient)
}

function* commandeClientSaga() {
    yield all([
        fork(fetchcommandeClientSaga)
    ])
}


export default commandeClientSaga