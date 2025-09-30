

const INIT = {
    WifiConnected: true,

}

const NetworkReducer = (state = INIT, action) => {
    switch (action.type) {
        case 'SETWIFICONNECTED':

            return { ...state, WifiConnected: true };
        case 'SETWIFIDESCONNECTED':

            return { ...state, WifiConnected: false };

        default:
            return { ...state };
    }
}

export {
    NetworkReducer
};

