
import { GETMENU, GETMENUFAILED, GETMENUSUCCESS } from '../constants/menuActionType';

const initialState = {
  menu: [],
  isLoading: false,
  error: null
};

export default menuReducer = (state = initialState, action) => {
  switch (action.type) {
    case GETMENU:
      return { ...state, isLoading: true };
    case GETMENUSUCCESS:
      return { ...state, isLoading: false, menu: action.payload.menu, error: null };
    case GETMENUFAILED:
      return { ...state, isLoading: false, error: action.payload.error, menu: null };
    default:
      return { ...state };
  }
} 

