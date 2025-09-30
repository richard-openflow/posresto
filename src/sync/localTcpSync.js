import AsyncStorage from "@react-native-async-storage/async-storage";
// import {  bookingController, CommandController, ActionType, SendToMaster, Sleep } from "@utils";

import { store } from '@redux';
import { ValidateIPaddress } from "../utils/helpers";

const localTcpSync = async () => {

    const a = await AsyncStorage.getItem("RemoteHostIp");

    if (a == "MASTER" && store.getState().UseNetworkReducer.connected)
        store.dispatch({ type: "SHOWSYNCMODAL" })
    else if (ValidateIPaddress(a)) {
        // CommandController.getSavedlocally().then(e => {
        //     e.map((c, i) => {
        //         // if (i > 0)
        //         //   return
        //         let cmd = JSON.parse(JSON.stringify(c))
        //         // alert(JSON.stringify({ ...cmd }, "", "\t"))
        //         SendToMaster(ActionType.server.createLocalCommand, { command: { ...cmd, savedOnline: true } })

        //     })
        // })
        // bookingController.getSavedlocally().then((e) => {
        //     // console.warn(JSON.stringify(e, "", "\t"))
        //     e.forEach(async (b, i) => {
        //         await Sleep(1500)
        //         let bkn = JSON.parse(JSON.stringify(b));
        //         SendToMaster(ActionType.server.createLocalBooking, { booking: { ...bkn, savedOnline: false } })

        //     })
        // });
    }
}
export {
    localTcpSync
}