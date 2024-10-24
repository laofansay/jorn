import password from "@/app/shared/reducers/account/password.reducer";
import register from "@/app/shared/reducers/account/register.reducer";
import settings from "@/app/shared/reducers/account/settings.reducer";
import authentication from "@/app/shared/reducers/authentication";

import everyDayBill from "@/app/shared/reducers/entities/every-day-bill.reducer";
import checkJob from "@/app/shared/reducers/entities/check-job.reducer";
import checkJobDay from "@/app/shared/reducers/entities/check-job-day.reducer";
import checkJobLog from "@/app/shared/reducers/entities//check-job-log.reducer";
import quickBooksClient from "@/app/shared/reducers/entities/quick-books-client.reducer";
import quickBooksToken from "@/app/shared/reducers/entities/quick-books-token.reducer";

import googleFile from "@/app/shared/reducers/entities/google-drive.reducer";

import { authReducer } from "@/store/authSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { ThunkAction, UnknownAction } from "@reduxjs/toolkit";
import exp from "constants";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

import authMiddleware from "./authMiddleware";

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: number) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const authPersistConfig = {
  key: "auth",
  storage: storage,
  whitelist: ["authState"],
};

const persistedReducer = persistReducer(authPersistConfig, authReducer);

const rootReducer = combineReducers({
  auth: persistedReducer,
  authentication,
  everyDayBill,
  checkJob,
  googleFile,
  checkJobDay,
  quickBooksClient,
  checkJobLog,
  quickBooksToken,
  password,
  settings,
  register,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(authMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>;

export default store;
