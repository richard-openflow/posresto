
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
import { LogBox, StatusBar, View } from 'react-native'
import { MMKV } from 'react-native-mmkv'
import { persistor } from './src/redux'
import { CommandController, initDatabase } from './src/utils/sqliteDB'

// // Ignore log notification by message
LogBox.ignoreLogs(['Warning: ...']);
//Ignore all log notifications
LogBox.ignoreAllLogs();

const App = () => {

  const [dbInitialized, setDbInitialized] = useState(false);
  const storage = new MMKV()

  useEffect(() => {
    const initDB = async () => {
      try {
        await initDatabase();
        setDbInitialized(true);
        console.log('SQLite database initialized successfully');
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };
    initDB();
  }, []);

  useEffect(() => {
    if (!dbInitialized) return;

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
        CommandController.create([...orders])
      },
      () => { })

  }, [store, dbInitialized])

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





  if (!dbInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      </View>
    );
  }

  return (
    <PaperProvider>
      <StatusBar hidden />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Routing />
        </PersistGate>
      </Provider>
    </PaperProvider>


  )
}

export default App

