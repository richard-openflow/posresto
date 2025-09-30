import { GET_EMPLOYEE_STUFF, SET_EMPLOYEE_ACTIVE_STUFF, SET_EMPLOYEE_STUFF_FAILED, SET_EMPLOYEE_STUFF_SUCCUSS } from "../constants/StuffEmployeeActionTypes";

export const getEmployeeStuff = (data) => ({ type: GET_EMPLOYEE_STUFF, payload: data })
export const setEmployeeStuffSuccess = (data) => ({ type: SET_EMPLOYEE_STUFF_SUCCUSS, payload: data })
export const setEmployeeStuffFailed = (data) => ({ type: SET_EMPLOYEE_STUFF_FAILED, payload: data })
export const setEmployeeActiveStuff = (data) => ({ type: SET_EMPLOYEE_ACTIVE_STUFF, payload: data })