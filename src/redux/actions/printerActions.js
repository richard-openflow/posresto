import { ADDPRINTER, DELETEPRINTER, EDITPRINTER, GETPRINTER, GETPRINTERFAILED, GETPRINTERSUCCESS } from "../constants/printerActionType"





export const getPrinter = (data) => ({
    type: GETPRINTER,
    payload: data
})
export const getPrinterSuccess = (data) => ({
    type: GETPRINTERSUCCESS,
    payload: data
})

export const getPrinterFailed = (data) => ({
    type: GETPRINTERFAILED,
    payload: { error: data }
})

export const addPrinter = (data) => ({
    type: ADDPRINTER,
    payload: data
})

export const editPrinter = (data) => ({
    type: EDITPRINTER,
    payload: data
})
export const deletePrinter = (data) => ({
    type: DELETEPRINTER,
    payload: data
})