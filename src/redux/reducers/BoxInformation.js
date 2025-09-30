import { GETBOXINFORMATION, GETBOXINFORMATIONFAILED, GETBOXINFORMATIONSUCCESS } from "../constants/BoxInformationTypes";

const INIT = {
    boxInformation: [],
    loading: false
}

const BoxInformationReducer = (state = INIT, action) => {
    switch (action.type) {
        case GETBOXINFORMATION:

            return { ...state, loading: true };
        case GETBOXINFORMATIONSUCCESS:

            return { ...state, loading: false, boxInformation: action.payload };
        case GETBOXINFORMATIONFAILED:
            return { ...state, }
        default:
            return { ...state };
    }
}

export {
    BoxInformationReducer
};
