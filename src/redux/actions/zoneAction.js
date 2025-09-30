import { GETZONE, GETZONEFAILED, GETZONESUCCESS } from "../constants/zoneActionType"



export const getZone = (data) => ({
    type: GETZONE,
    payload: data
})
export const getZoneSuccess = (data) => ({
    type: GETZONESUCCESS,
    payload: data
})

export const getZoneFailed = (data) => ({
    type: GETZONEFAILED,
    payload: { error: data }
})