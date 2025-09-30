import { GET_EMPLOYEE_STUFF, SET_EMPLOYEE_ACTIVE_STUFF, SET_EMPLOYEE_STUFF_FAILED, SET_EMPLOYEE_STUFF_SUCCUSS } from "../constants/StuffEmployeeActionTypes";

const INIT_STATE = {
    isLoading: false,
    error: null,
    stuff: [],
    activeStuff: {},
}

const StuffEmployeeReducer = (state = INIT_STATE, action) => {
    let activeStuff = {}
    switch (action?.type) {
        case GET_EMPLOYEE_STUFF:
            return { ...state, stuff: [], isLoading: true, error: null };
        case SET_EMPLOYEE_STUFF_SUCCUSS:
            return { ...state, stuff: [...action?.payload], isLoading: false, error: null };
        case SET_EMPLOYEE_STUFF_FAILED:
            return { ...state, stuff: [], isLoading: false, error: null };
        case SET_EMPLOYEE_ACTIVE_STUFF:
            activeStuff = state?.stuff.filter((a) => action?.payload + '' == '' + a._id)[0] || {}
            return { ...state, activeStuff, isLoading: false, error: null };
        default:
            return { ...state };
    }
}

export default StuffEmployeeReducer