// store.js
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer, REGISTER } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RegistrationSlice from "./RegistrationSlice";
import authReducer from './LogInSlice';


const rootReducer = combineReducers({
 Registration: RegistrationSlice, // from slices/authSlice.js
  auth: authReducer, 
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  //whitelist: ['User'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  //devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

export { store, persistor };
