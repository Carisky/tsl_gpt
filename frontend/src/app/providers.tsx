"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "@/theme/theme";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeBridge>{children}</ThemeBridge>
      </PersistGate>
    </Provider>
  );
}

function ThemeBridge({ children }: { children: React.ReactNode }) {
  const mode = useSelector((s: RootState) => s.ui.mode);
  const theme = React.useMemo(() => getTheme(mode), [mode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
