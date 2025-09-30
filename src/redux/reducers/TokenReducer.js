import AsyncStorage from '@react-native-async-storage/async-storage';
import { SETTOKEN } from '../constants/tokenActionType';
const initialState = {
  token: null
};

export default tokenReducer = (state = initialState, action) => {
  switch (action.type) {
    case SETTOKEN:
      if (action.payload.token)
        AsyncStorage.setItem('token', action.payload.token)
      return { ...state, token: action.payload.token };
    default:
      return { ...state };
  }
} 