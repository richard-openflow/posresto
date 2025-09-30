
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import tokenReducer from './reducers/TokenReducer'
import userReducer from './reducers/UserReducers'
import commandeClientReducer from './reducers/commandeClientReducer'
import menuReducer from './reducers/menuReducer'
import rootSaga from './sagas'

import { MMKV } from 'react-native-mmkv'
import { persistReducer, persistStore } from 'redux-persist'
import { BoxInformationReducer } from './reducers/BoxInformation'
import commandeReducer from './reducers/CommandeReducer'
import { DevicesReducer } from './reducers/DeivceReducer'
import StuffEmployeeReducer from './reducers/EmployeeStuffReducer'
import HistoriqueReducer from './reducers/HistoriqueReducer'
import { NetworkReducer } from './reducers/NetworkReducer'
import PrinterReducer from './reducers/PrinterReducer'
import SettingsReducer from './reducers/SettingsReducer'
import ZoneReducer from './reducers/ZoneReducer'
import ModalReducer from './reducers/modalReducer'
import orderReducer from './reducers/orderReducer'
import productionTypes from './reducers/productionTypes'
import tableReducer from './reducers/tableReducer'
import { TcpReducer } from './reducers/tcpReducer'

const storage = new MMKV()
const MMKVStorage = {
  setItem: (key, value) => {

    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key) => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key) => {
    storage.delete(key);
    return Promise.resolve();
  },
};

const sagaMiddleware = createSagaMiddleware()

const rootReducer = combineReducers({
  user: userReducer,
  menu: menuReducer,
  token: tokenReducer,
  commandeClient: commandeClientReducer,
  command: commandeReducer,
  historique: HistoriqueReducer,
  table: tableReducer,
  setting: SettingsReducer,
  Modal: ModalReducer,
  TCP: TcpReducer,
  stuff: StuffEmployeeReducer,
  zone: ZoneReducer,
  order: orderReducer,
  printer: PrinterReducer,
  productionTypes,
  BoxInformation: BoxInformationReducer,
  Device: DevicesReducer,
  WifiConnect: NetworkReducer
})

const persistConfig = {
  key: 'root',
  storage: MMKVStorage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false, think: true, immutableCheck: false })/*.prepend(require('redux-immutable-state-invariant').default())*/.prepend(sagaMiddleware)
})


sagaMiddleware.run(rootSaga)



export const persistor = persistStore(store)

export {
  store
}

