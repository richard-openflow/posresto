import { GETTABLE, GETTABLEFAILED, GETTABLESUCCESS } from "../constants/tableActionType";


const initialState = {
  table: [],
  isLoading: false,
  error: null
};

export default tableReducer = (state = initialState, action) => {
  switch (action.type) {
    case GETTABLE:
      return { ...state, isLoading: true };
    case GETTABLESUCCESS:
      return { ...state, isLoading: false, table: action.payload };
    case GETTABLEFAILED:
      return { ...state, isLoading: false, error: null };
    default:
      return { ...state };
  }
} 