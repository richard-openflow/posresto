
import { GETMENU, GETMENUFAILED, GETMENUSUCCESS } from "../constants/menuActionType";


export const getMenu = (data) => ({
    type: GETMENU,
    payload: data
})

export const getMenuSuccess = (data) => ({
    type: GETMENUSUCCESS,
    payload: { menu: data }
})

export const getMenuFailed = (data) => ({
    type: GETMENUFAILED,
    payload: { error: data }
})

