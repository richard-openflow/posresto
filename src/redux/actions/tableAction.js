import { GETTABLE, GETTABLEFAILED, GETTABLESUCCESS } from "../constants/tableActionType"

export const getTable = (data) => ({
    type: GETTABLE,
    payload: data
})
export const getTableSuccess = (data) => ({
    type: GETTABLESUCCESS,
    payload: data
})

export const gettableFailed = (data) => ({
    type: GETTABLEFAILED,
    payload: { error: data }
})