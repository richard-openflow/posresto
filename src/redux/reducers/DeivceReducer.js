import { GETDEVICES, GETDEVICESFAILED, GETDEVICESSUCCESS } from "../constants/DevicesTypes";



const INIT = {
    devices: [],
    loading: false
}

const DevicesReducer = (state = INIT, action) => {
    switch (action.type) {
        case GETDEVICES:

            return { ...state, loading: true };
        case GETDEVICESSUCCESS:

            return { ...state, loading: false, devices: action.payload };
        case GETDEVICESFAILED:
            return { ...state, }
        default:
            return { ...state };
    }
}

export {
    DevicesReducer
};
