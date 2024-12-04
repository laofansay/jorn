"use client";

import { Toaster } from "react-hot-toast";

export const ToastProvider = () => {
  return (
    <Toaster
      toastOptions={{
        duration: 3000,
      }}
      containerStyle={{
        zIndex: 9999999,
      }}
    />
  );
};
