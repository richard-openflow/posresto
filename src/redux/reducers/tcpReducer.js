const INIT = {
    TCP_Loading: false
}

const TcpReducer = (state = INIT, action) => {
    switch (action.type) {
        case 'TCP_DATA_SENDING_LOADING':

            return { ...state, TCP_Loading: true };
        case 'TCP_DATA_SENT_LOADING':

            return { ...state, TCP_Loading: false };
        case "SYNC_DATA":
            return { ...state, }
        default:
            return { ...state };
    }
}

export {
    TcpReducer
};
