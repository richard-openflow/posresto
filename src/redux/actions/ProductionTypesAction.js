import { GETPRODUCTIONTYPES, GETRODUCTIONTYPESFAILED, GETRODUCTIONTYPESSUCCESS } from "../constants/productionTypesActionType"




export const getProductionTypes = (data) => ({
    type: GETPRODUCTIONTYPES,
    payload: data
})
export const getProductionTypesSuccess = (data) => ({
    type: GETRODUCTIONTYPESSUCCESS,
    payload: data
})

export const getProductionTypesFailed = (data) => ({
    type: GETRODUCTIONTYPESFAILED,
    payload: { error: data }
})