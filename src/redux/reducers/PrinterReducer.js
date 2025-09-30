import { ADDPRINTER, EDITPRINTER, GETPRINTER, GETPRINTERFAILED, GETPRINTERSUCCESS, DELETEPRINTER } from "../constants/printerActionType";


const initialState = {
  printer: [],
  isLoading: false,
  error: null
};

export default PrinterReducer = (state = initialState, action) => {
  switch (action.type) {
    case GETPRINTER:
      return { ...state, isLoading: true };
    case GETPRINTERSUCCESS:
      return { ...state, isLoading: false, printer: action?.payload };
    case GETPRINTERFAILED:
      return { ...state, isLoading: false, error: null };
    case ADDPRINTER:
      return { ...state, printer: [...state?.printer?.filter((e) => e?._id + '' != action?.payload?._id + ''), action?.payload] };
    case EDITPRINTER:
      return { ...state, printer: [...(state?.printer?.filter((e) => e._id + '' != action.payload._id + '')), action?.payload] };
    case DELETEPRINTER:
      return { ...state, printer: [...(state?.printer?.filter((e) => e._id + '' != action.payload + ''))] };
    default:
      return { ...state };
  }
} 