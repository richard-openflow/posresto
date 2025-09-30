import { API } from "@utils"
import { all, call, fork, put, takeEvery } from 'redux-saga/effects'
import { UnitController } from '../../utils/realmDB/service/UnitService'
import { ZoneController } from '../../utils/realmDB/service/ZoneService'
import { gettableFailed, getTableSuccess } from '../actions/tableAction'
import { getZoneSuccess } from '../actions/zoneAction'
import { GETTABLE } from '../constants/tableActionType'

function* fetchTable(action) {
 
    try {
        const res = yield call(API.post, "settings/units", action.payload)
        const { zones } = yield call(API.post, "settings/get-zone", action.payload);

        const tbs = []
        const zns = []

        ZoneController.clear(action.payload.pointOfSaleId)
        for (let i = 0; i < zones.length; i++) {
            const z = zones[i];
            const zn = yield call(ZoneController.create, z, action.payload.pointOfSaleId)
            zns.push(zn)
        }

        const tables = res.filter(d => !d.isArchived);
        for (let index = 0; index < res.length; index++) {
            const unit = tables[index];
            const t = yield call(UnitController.create, unit, action.payload.pointOfSaleId)
            tbs.push(t)
        }

        yield put(getTableSuccess(JSON.parse(JSON.stringify(tbs))))
        yield put(getZoneSuccess(JSON.parse(JSON.stringify(zns))))
    } catch (error) {

        yield put(gettableFailed(error))

    }

}


function* fetchTableSaga() {
    yield takeEvery(GETTABLE, fetchTable)
}
function* tableSaga() {
    yield all([
        fork(fetchTableSaga)
    ])
}


export default tableSaga