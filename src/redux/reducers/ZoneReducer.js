import { GETZONE, GETZONEFAILED, GETZONESUCCESS } from "../constants/zoneActionType";


const initialState = {
  zone: [],
  isLoading: false,
  error: null
};

export default ZoneReducer = (state = initialState, action) => {
  switch (action.type) {
    case GETZONE:
      return { ...state, isLoading: true };
    case GETZONESUCCESS:
      return { ...state, isLoading: false, zone: action.payload };
    case GETZONEFAILED:
      return { ...state, isLoading: false, error: null };
    default:
      return { ...state };
  }
} 