import { API } from "@utils";
import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { getHistoriqueFailed, getHistoriqueSuccess } from '../actions/HistoriqueActions';
import { GET_HISTORIQUE } from '../constants/HistoriqueActionsTypes';

function* fetchHistorique(action) {
    try {
        const res = yield call(API.post, "/orders/orders-History"
            , {
                "pointOfSaleId": "629f392f297a647b71389af5",
                "dateRange": {
                    start: action.payload.start,
                    end: action.payload.end
                }
            }
        );
        
        yield put(getHistoriqueSuccess(res.orders));
    } catch (error) {
       
        yield put(getHistoriqueFailed(error));
    }
}

function* fetchHistoriqueSaga() {
    yield takeEvery(GET_HISTORIQUE, fetchHistorique);
}

function* historiqueSaga() {
    yield all([fork(fetchHistoriqueSaga)]);
}

export default historiqueSaga;