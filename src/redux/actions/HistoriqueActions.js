import { GET_HISTORIQUE, GET_HISTORIQUE_FAILED, GET_HISTORIQUE_SUCCESS } from "../constants/HistoriqueActionsTypes"


export const getHistorique = (data) => ({
    type: GET_HISTORIQUE,
    payload: data
})

export const getHistoriqueSuccess = (data) => ({
    type: GET_HISTORIQUE_SUCCESS,
    payload: { historique: data }
})

export const getHistoriqueFailed = (data) => ({
    type: GET_HISTORIQUE_FAILED,
    payload: { error: data }
})