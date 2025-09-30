import { GETPRODUCTIONTYPES, GETRODUCTIONTYPESFAILED, GETRODUCTIONTYPESSUCCESS } from "../constants/productionTypesActionType";




const initialState = {
    ProductionTypes: [],
    isLoading: false,
    error: null
};

export default ProductionTypesReducer = (state = initialState, action) => {
    switch (action.type) {
        case GETPRODUCTIONTYPES:
            return { ...state, isLoading: true };
        case GETRODUCTIONTYPESSUCCESS:
            return { ...state, isLoading: false, ProductionTypes: action.payload };
        case GETRODUCTIONTYPESFAILED:
            return { ...state, isLoading: false, error: null };
        default:
            return { ...state };
    }
} 