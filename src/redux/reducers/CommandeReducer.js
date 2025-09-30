import { GETCOMMAND, GETCOMMANDFAILED, GETCOMMANDSUCCESS } from "../constants/CommandeActionTypes";

const initialState = {
    command: [],
    isLoading: false,
    error: null
};

export default commandReducer = (state = initialState, action) => {
    switch (action.type) {
        case GETCOMMAND:
            return { ...state, isLoading: true };
        case GETCOMMANDSUCCESS:
            return { ...state, isLoading: false, command: action.payload.command };
        case GETCOMMANDFAILED:
            return { ...state, isLoading: false, error: action.payload.error };
        default:
            return { ...state };
    }
} 