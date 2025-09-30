import { COMMANDFAILED, COMMANDSENT, SENDCOMMAND } from "../constants/commandeClientActionType";

const initialState = {
  isSending: false,
  error: null,
  commandClient: [],
};

export default commandClientReducer = (state = initialState, action) => {
  switch (action.type) {
    case SENDCOMMAND:

      return {
        ...state,
        isSending: true,

      };
    case COMMANDSENT:
      return {
        ...state,
        isSending: false,
        commandClient: action.payload.commandClient,

      };
    case COMMANDFAILED:
      return {
        ...state,
        isSending: false,
        error: action.payload.error,

      };
    default:
      return { ...state };
  }
};

