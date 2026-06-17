import type { Storage } from 'redux-persist';

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import createSagaMiddleware from 'redux-saga';

import { reactotronReduxEnhancer } from './reactotron';
import { rootSaga } from './rootSaga';
import { storage } from './storage';
import { accountReducer } from '@services/slices/account/accountSlice';
import { appReducer } from '@services/slices/app/appSlice';
import { authReducer } from '@services/slices/auth/authSlice';
import { counterReducer } from '@services/slices/counter/counterSlice';

const reduxStorage: Storage = {
  getItem: key => Promise.resolve(storage.getString(key) ?? undefined),
  removeItem: key => {
    storage.remove(key);
    return Promise.resolve();
  },
  setItem: (key, value: string) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
};

const rootReducer = combineReducers({
  account: accountReducer,
  app: appReducer,
  auth: authReducer,
  counter: counterReducer,
});

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  // whitelist: ['app', 'auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  enhancers: getDefaultEnhancers =>
    getDefaultEnhancers().concat(
      reactotronReduxEnhancer,
    ) as unknown as ReturnType<typeof getDefaultEnhancers>,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
        ignoredActionPaths: ['payload.onSuccess', 'payload.onFailure'],
      },
      thunk: false,
    }).concat(sagaMiddleware),
  reducer: persistedReducer,
});

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
