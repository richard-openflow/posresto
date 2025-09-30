
import AsyncStorage from '@react-native-async-storage/async-storage'
import pointOfSaleController from '../../utils/realmDB/service/PointOfSale'
import { UserController } from '../../utils/realmDB/service/UserService'
import {
    ASKFORACCESS,
    ASKFORACCESSBYTOKEN,
    CONFIRMACCESS,
    CONFIRMACCESSBYTOKEN,
    DEINEDACCESS,
    GETCONTACTBYPHONE,
    SET_CURRENT_RESTAURANT,
    SET_RESTAURANTS,
    SET_USER_ROLE,
    DEFINEMASTERINGTYPE,
    ISLINKEDTORODERS
} from '../constants/UserActionsType'



const init = {
    role: '',
    isMaster: false,
    user: null,
    isLoading: false,
    error: null,
    token: null,
    restaurants: null,
    currentRestaurant: null

}

export default UserReducer = (state = init, action) => {

    switch (action.type) {
        case ASKFORACCESS:
            return { ...state, isLoading: true, error: null }

        case ASKFORACCESSBYTOKEN:
            return { ...state, isLoading: true, error: null }
        case CONFIRMACCESS:
            AsyncStorage.setItem('token', action.payload.token)
            UserController.create({ ...action.payload.user, connectedUser: true })
            pointOfSaleController.create(action.payload.restaurants)

            return { ...state, isLoading: false, error: null, user: action.payload.user, token: action.payload.token, restaurants: action.payload.restaurants }
        case CONFIRMACCESSBYTOKEN:
            return { ...state, isLoading: false, error: null, user: action.payload.user, restaurants: action.payload.restaurants }
        case "LOGOUT":
            return { ...init }
        case SET_CURRENT_RESTAURANT:
            return { ...state, currentRestaurant: action.payload }
        case SET_RESTAURANTS:
            return { ...state, restaurants: action.payload }
        case SET_USER_ROLE:
            return { ...state, role: action.payload }
        case DEINEDACCESS:
            AsyncStorage.removeItem('token')
            return { ...state, isLoading: false, error: action.payload }
        case GETCONTACTBYPHONE:
            return { ...state };
        case DEFINEMASTERINGTYPE:
            return { ...state, isMaster: action?.payload }
        case ISLINKEDTORODERS:
            return { ...state, isLinked: action?.payload }
        default:
            return { ...state };
    }
}