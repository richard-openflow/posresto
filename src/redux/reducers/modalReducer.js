import { CommandController } from "../../utils/realmDB/service/commandService";
import { HIDE_MODAL_ACTION_TABLE_MAP, SHOW_MODAL_ACTION_TABLE_MAP } from "../constants/ModalActionTypes";

const INIT_STATE = {
    showTableModal: false,
    enableSelectUnit: null,
    unit: {},
    showCancelPremission: false,
    showPayTypeModal: false,
    showNoteKitchen: false,
    showProfile: false,
    _id: null,
    orderNumber: null,
    printerId: null,
    showKeyPad: false,
    showStuffPinPad: true,
    unitNumber: '',
    showModalRapport: false,
    ModalAddPrinter: false,

}


const ModalReducer = (state = INIT_STATE, action) => {
    switch (action?.type) {
        case 'SHOW_PREMISSION_CANCEL':
            return { ...state, showCancelPremission: true, _id: action?.payload?._id, orderNumber: action?.payload?.orderNumber };
        case 'HIDE_PREMISSION_CANCEL':
            if (action.payload)
                CommandController.cancelCommnadItem(state?._id)
            return { ...state, showCancelPremission: false, _id: null };
        case 'SHOW_PAY_TYPE':
            // return { ...state, showPayTypeModal: true, _id: action?.payload };
            return { ...state, showPayTypeModal: true, orderNumber: action?.payload };
        case 'HIDE_PAY_TYPE':
            // if (action?.payload?.payType && action?.payload?.amount && state?._id)
            //     CommandController.payCommand(
            //         state?._id,
            //         action.payload.payType,
            //         action.payload.amount,
            //         true,
            //         action.payload.roomNumber,
            //         action.payload.firstName,
            //         action.payload.lastName,
            //         action.payload.phone,
            //         action.payload.email,
            //         action.payload.products,
            //         action?.payload?.currentRestaurant,
            //         action.payload.offertBy,
            //     );
            return { ...state, showPayTypeModal: false, _id: null };
        case 'NEXT_PAY_TYPE':

            if (action?.payload?.payType && action?.payload?.amount && state?._id)
                CommandController.payCommand(
                    state?._id,
                    action.payload.payType,
                    action.payload.amount,
                    true,
                    action.payload.roomNumber,
                    action.payload.firstName,
                    action.payload.lastName,
                    action.payload.phone,
                    action.payload.email,
                    action.payload.products,
                    action?.payload?.currentRestaurant,
                    action.payload.offertBy,
                );
            return { ...state, showPayTypeModal: true, };
        case 'SHOW_NOTE_KITCHEN':
            return { ...state, showNoteKitchen: true, orderNumber: action?.payload };
        case 'HIDE_NOTE_KITCHEN':
            if (action?.payload?.note)
                CommandController.noteACommand(state?.orderNumber, action.payload.note)
            return { ...state, showNoteKitchen: false, orderNumber: null };
        case 'SHOW_PROFILE':
            return { ...state, showProfile: true, _id: action?.payload };
        case 'HIDE_PROFILE':
            return { ...state, showProfile: false, _id: null };
        case 'SHOW_KEY_PAD':
            return { ...state, showKeyPad: true, unitNumber: '' };
        case 'HIDE_KEY_PAD':
            return { ...state, showKeyPad: false, unitNumber: '' };
        case 'FIND_COMMAND_BY_NUMBER':
            return { ...state, showKeyPad: false, unitNumber: action?.payload };
        case SHOW_MODAL_ACTION_TABLE_MAP:
            return { ...state, showTableModal: true, unit: action?.payload, enableSelectUnit: false }
        case HIDE_MODAL_ACTION_TABLE_MAP:
            return { ...state, showTableModal: false, unit: {}, enableSelectUnit: action.payload }
        case "SHOW_RAPPORT_MODAL":
            return { ...state, showModalRapport: true, }
        case "HIDE_RAPPORT_MODAL":
            return { ...state, showModalRapport: false, }
        case 'SHOW_MODAL_ADD_PRINTER':
            return { ...state, ModalAddPrinter: true }
        case 'SHOW_MODAL_EDIT_PRINTER':
            return { ...state, ModalAddPrinter: true, printerId: action.payload }
        case 'HIDE_MODAL_ADD_PRINTER':
            return { ...state, ModalAddPrinter: false, printerId: null }

        default:
            return { ...state };
    }
}

export default ModalReducer
