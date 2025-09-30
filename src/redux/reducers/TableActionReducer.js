import { HIDE_MODAL_ACTION_TABLE_MAP, SHOW_MODAL_ACTION_TABLE_MAP } from "../constants/ModalActionTypes";

const INIT_STATE = {
    show: false
};
const TableActionReducer = (state = INIT_STATE, action) => {
    switch (action?.type) {
        case SHOW_MODAL_ACTION_TABLE_MAP:
            return { ...state, show: true }

        case HIDE_MODAL_ACTION_TABLE_MAP:
            return { ...state, show: false }

        default:
            return { ...state };
    }
}

export default TableActionReducer