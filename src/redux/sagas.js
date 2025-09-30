import { all } from 'redux-saga/effects'
import commandeClientSaga from './sagas/commandeClientSaga'
import commandSaga from './sagas/CommandSaga'
import DeviceSaga from './sagas/DevicesSaga'
import historiqueSaga from './sagas/HistoriqueSaga'
import menuSaga from './sagas/menuSAGA'
import StuffEmployeeSaga from './sagas/stuffEmployeSaga'
import tableSaga from './sagas/tableSaga'
import userSaga from './sagas/userSAGA'
import OrderSaga from './sagas/OrderSaga'
import PrinterSaga from './sagas/PrinterSaga'

export default function* rootSaga() {
    yield all([
        userSaga(),
        menuSaga(),
        commandeClientSaga(),
        commandSaga(),
        historiqueSaga(),
        tableSaga(),
        StuffEmployeeSaga(),
        DeviceSaga(),
        OrderSaga(),
        PrinterSaga()
    ])
}
