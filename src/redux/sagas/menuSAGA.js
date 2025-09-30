import { API } from "@utils"
import { all, call, delay, fork, put, takeEvery } from 'redux-saga/effects'
import { menuController } from '../../utils/realmDB/service/MenuService'
import { getMenuFailed, getMenuSuccess } from '../actions/menuAction'
import { GETMENU } from '../constants/menuActionType'

function* fetchMenu(action) {
    try {
        const res = yield call(API.post, "/menu/get-all-menus", { pointOfSaleId: action?.payload?.pointOfSaleId })

        const menus = []
        yield call(menuController.deletaAllTheOptions)
        yield delay(2000);
        for (let i = 0; i < res?.menu?.length; i++) {
            const menu = res.menu[i];
            const m = yield call(menuController.create, menu, action?.payload?.pointOfSaleId);
            menus.push(m)
        }
        yield put(getMenuSuccess(JSON.parse(JSON.stringify(menus))))
    } catch (error) {

        yield put(getMenuFailed(error))

    }

}


function* fetchMenuSaga() {
    yield takeEvery(GETMENU, fetchMenu)
}

function* menuSaga() {
    yield all([
        fork(fetchMenuSaga)
    ])
}

export default menuSaga