import { COMMANDFAILED, COMMANDSENT, SENDCOMMAND } from "../constants/commandeClientActionType"

export const sendCommand = (data) => ({
    type: SENDCOMMAND,
    payload: data
})

export const commandSent = (data) => ({
    type:COMMANDSENT,
    payload: { commandClient: data }
})

export const commandFailed = (data) => ({
    type: COMMANDFAILED,
    payload: { error: data }
})