"use client";

import { Provider } from "react-redux";
import { store } from "./index";
import { persistStore } from "redux-persist";
import { bindActionCreators } from "redux";
import setupAxiosInterceptors from "@/app/shared/reducers/axios-interceptor";

import { clearAuthentication } from "@/app/shared/reducers/authentication";

persistStore(store);

const actions = bindActionCreators({ clearAuthentication }, store.dispatch);
setupAxiosInterceptors(() =>
  actions.clearAuthentication("login.error.unauthorized"),
);

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
