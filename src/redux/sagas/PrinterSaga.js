import { API } from "@utils"
import { all, call, fork, put, takeEvery } from 'redux-saga/effects'
import { getDevicesFailed, getDevicesSuccess } from '../actions/DevicesActions'
import { DELETEPRINTER } from "../constants/printerActionType"
import { PrinterServices } from "../../utils/realmDB/service/PrinterService"

function* deletePrinter(action) {
    try {
        PrinterServices.delete({ _id: action.payload })
    } catch (error) {
        console.log(error)
    }

}

function* deletePrinterSaga() {
    yield takeEvery(DELETEPRINTER, deletePrinter)
}

function* PrinterSaga() {
    yield all([
        fork(deletePrinterSaga)
    ])
}

export default PrinterSaga