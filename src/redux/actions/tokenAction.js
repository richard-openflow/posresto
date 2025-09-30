import { SETTOKEN } from "../constants/tokenActionType";


export const settoken = (token) => ({
    type: SETTOKEN,
    payload: token
})