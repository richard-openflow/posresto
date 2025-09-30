import { GETBOXINFORMATION, GETBOXINFORMATIONFAILED, GETBOXINFORMATIONSUCCESS } from "../constants/BoxInformationTypes"


export const getBoxInformation = (data) => ({
    type: GETBOXINFORMATION,
    payload: data
})

export const getBoxInformationSuccess = (data) => ({
    type: GETBOXINFORMATIONSUCCESS,
    payload: data
})

export const getBoxInformationFailed = (data) => ({
    type: GETBOXINFORMATIONFAILED,
    payload: { error: data }
})

