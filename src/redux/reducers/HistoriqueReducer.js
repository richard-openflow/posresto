import { GET_HISTORIQUE, GET_HISTORIQUE_FAILED, GET_HISTORIQUE_SUCCESS } from "../constants/HistoriqueActionsTypes";


const initialState = {
    historique: [],
    isLoading: false,
    error: null
};

export default historiqueReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_HISTORIQUE:
            return { ...state, isLoading: true };
        case GET_HISTORIQUE_SUCCESS:
            return { ...state, isLoading: false, historique: action.payload.historique};
        case GET_HISTORIQUE_FAILED:
            return { ...state, isLoading: false, error: action.payload.error };
        default:
            return { ...state };
    }
}