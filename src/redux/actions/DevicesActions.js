import { GETDEVICES, GETDEVICESFAILED, GETDEVICESSUCCESS } from "../constants/DevicesTypes"



export const getDevices = (data) => ({
    type: GETDEVICES,
    payload: data
})

export const getDevicesSuccess = (data) => ({
    type: GETDEVICESSUCCESS,
    payload: data
})

export const getDevicesFailed = (data) => ({
    type: GETDEVICESFAILED,
    payload: { error: data }
})

