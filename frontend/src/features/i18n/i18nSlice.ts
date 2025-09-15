"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Locale = "en" | "ru" | "pl";

interface I18nState {
  locale: Locale;
}

const detectLocale = (): Locale => {
  if (typeof navigator !== "undefined") {
    const lang = navigator.language?.slice(0, 2).toLowerCase();
    if (lang === "ru" || lang === "pl") return lang as Locale;
  }
  return "en";
};

const initialState: I18nState = {
  locale: detectLocale(),
};

const i18nSlice = createSlice({
  name: "i18n",
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<Locale>) => {
      state.locale = action.payload;
    },
  },
});

export const { setLocale } = i18nSlice.actions;
export default i18nSlice.reducer;

