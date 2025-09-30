import {
    ASKFORACCESS,
    ASKFORACCESSBYTOKEN,
    CONFIRMACCESS,
    CONFIRMACCESSBYTOKEN,
    ISLINKEDTORODERS,
    DEFINEMASTERINGTYPE,
    DEINEDACCESS,
    GETCONTACTBYPHONE,
    SET_CURRENT_RESTAURANT,
    SET_RESTAURANTS,
    SET_USER_ROLE
} from "../constants/UserActionsType"


export const askForAccess = (data, callback) => ({
    type: ASKFORACCESS,
    payload: { data, callback }
})

export const askForAccessByToken = (data) => ({
    type: ASKFORACCESSBYTOKEN,
    payload: data
})

export const confirmaccess = (user, token, restaurants) => ({
    type: CONFIRMACCESS,
    payload: { user, token, restaurants }
})

export const confirmaccessByToken = (user, restaurants) => ({
    type: CONFIRMACCESSBYTOKEN,
    payload: { user, restaurants }
})

export const deinedaccess = (data) => ({
    type: DEINEDACCESS,
    payload: data
})

export const setCurrentRestaurant = (data) => ({
    type: SET_CURRENT_RESTAURANT,
    payload: data
})

export const setRestaurants = (data) => ({
    type: SET_RESTAURANTS,
    payload: data
})

export const setUserRole = (data) => ({
    type: SET_USER_ROLE,
    payload: data
})
export const getContactByPhone = (data) => ({
    type: GETCONTACTBYPHONE,
    payload: data
})
export const defineMasteringType = (data) => ({
    type: DEFINEMASTERINGTYPE,
    payload: data
})
export const isLinkedToOrder = (data) => ({
    type: ISLINKEDTORODERS,
    payload: data
})
