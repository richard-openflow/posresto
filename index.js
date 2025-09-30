/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import BackgroundFetch from "react-native-background-fetch";
import { MMKV } from 'react-native-mmkv';
import tinyEmitter from 'tiny-emitter/instance';
import { CommandController } from './src/utils/sqliteDB';

let savingHeadless = async (event) => {
    console.log('HEADKEKEK')
    const storage = new MMKV()
    const str = new MMKV({ id: 'pointOfSale' })
    // Get task id from event {}:
    let taskId = event.taskId;
    let isTimeout = event.timeout;  // <-- true when your background-time has expired.
    if (isTimeout) {
        // This task has exceeded its allowed running-time.
        // You must stop what you're doing immediately finish(taskId)

        BackgroundFetch.finish(taskId);
        return;
    }
    const data = JSON.parse(storage.getString("persist:root"))
    //const master = await AsyncStorage.getItem('MasterDevices')

    const { order } = data
    // const pointofsale = JSON.parse(str.getString('pos'))
    const { orders } = JSON.parse(order)




    CommandController.create(orders)



    // Required:  Signal to native code that your task is complete.
    // If you don't do this, your app could be terminated and/or assigned
    // battery-blame for consuming too much time in background.
    BackgroundFetch.finish(taskId);
}

// Register your BackgroundFetch HeadlessTask
BackgroundFetch.registerHeadlessTask(savingHeadless);

AppRegistry.registerComponent(appName, () => App);
