import { HIDE_MODAL_ACTION_TABLE_MAP, SHOW_MODAL_ACTION_TABLE_MAP } from "../constants/ModalActionTypes"

export const showModalActionTableMap = (data) => ({ type: SHOW_MODAL_ACTION_TABLE_MAP, payload: data })
export const hideModalActionTableMap = (data = null) => ({ type: HIDE_MODAL_ACTION_TABLE_MAP, payload: data })