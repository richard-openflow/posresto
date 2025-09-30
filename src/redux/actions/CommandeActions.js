import { GETCOMMAND, GETCOMMANDFAILED, GETCOMMANDSUCCESS } from "../constants/CommandeActionTypes"

export const getCommand = (data) => ({
    type: GETCOMMAND,
    payload: data
})

export const getCommandSuccess = (data) => ({
    type: GETCOMMANDSUCCESS,
    payload: { command: data }
})

export const getCommandFailed = (data) => ({
    type: GETCOMMANDFAILED,
    payload: { error: data }
})

