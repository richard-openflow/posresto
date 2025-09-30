import AsyncStorage from "@react-native-async-storage/async-storage"

const INIT_STATE = {
    show: true
}


export default SettingReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        case 'SET_SETTING':
            AsyncStorage.setItem('showImage', action.payload ? 'true' : 'false')
            return { ...state, show: action.payload }


        default:
            return { ...state }
    }
}