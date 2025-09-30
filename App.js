
import { store } from '@redux'
import React, { useEffect, useState } from 'react'
import BackgroundFetch from "react-native-background-fetch"
import ImmersiveMode from 'react-native-immersive-mode'
import KeepAwake from 'react-native-keep-awake'
import Orientation from 'react-native-orientation-locker'
import { PaperProvider } from 'react-native-paper'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import Routing from './src/route'
import { RealmProvider } from './src/utils/realmDB/store'
import { LogBox, StatusBar, View } from 'react-native'
import { MMKV } from 'react-native-mmkv'
import { persistor } from './src/redux'
import { CommandController } from './src/utils/realmDB/service/commandService'

// // Ignore log notification by message
LogBox.ignoreLogs(['Warning: ...']);
//Ignore all log notifications
LogBox.ignoreAllLogs();

const App = () => {



  const storage = new MMKV()

  useEffect(() => {
    BackgroundFetch.configure(
      {
        enableHeadless: true,
        minimumFetchInterval: 15,
        stopOnTerminate: false,
        taskId: 'OPENFLOW'

      },
      () => {
        const { order } = JSON.parse(storage.getString("persist:root"))
        const { orders } = JSON.parse(order)
        // for (const or of orders) {

        //   if (or?.commandProduct?.length > 0)
        CommandController.create([...orders])
        // }
      },
      () => { })

  }, [store])

  useEffect(() => {

    ImmersiveMode.setBarMode('FullSticky')
    ImmersiveMode.fullLayout(true);
    ImmersiveMode.setBarTranslucent(true)
    KeepAwake.activate();
    Orientation.lockToLandscape();
    ImmersiveMode.addEventListener((def) => {
      ImmersiveMode.setBarMode('FullSticky')
      ImmersiveMode.fullLayout(true);
      ImmersiveMode.setBarTranslucent(true)
    })
  }, [])





  return (
    <PaperProvider>
      <StatusBar hidden />
      <RealmProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Routing />
          </PersistGate>
        </Provider>
      </RealmProvider>
    </PaperProvider>


  )
}

export default App

