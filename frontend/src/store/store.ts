"use client";

import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import authReducer from "@/features/auth/authSlice";
import uiReducer from "@/features/ui/themeSlice";
import i18nReducer from "@/features/i18n/i18nSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  i18n: i18nReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "ui", "i18n"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
