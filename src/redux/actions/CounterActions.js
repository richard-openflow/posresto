
import { ADDONE, CLEAR, MINUSONE } from "../constants/counterActionTypes"


export const ADDONEAction = (data) => ({
    type: ADDONE,
    payload: data
})

export const MINUSONEAction = (data) => ({
    type: MINUSONE,
    payload: data
})
export const CLEARAction = (data) => ({
    type: CLEAR,
    payload: data
})