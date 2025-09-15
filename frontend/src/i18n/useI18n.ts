"use client";

import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { setLocale, type Locale } from "@/features/i18n/i18nSlice";
import { messages } from "@/i18n/messages";

export function useI18n() {
  const locale = useSelector((s: RootState) => s.i18n.locale);
  const dispatch = useDispatch<AppDispatch>();

  const t = (key: string, params?: Record<string, string | number>) => {
    const dict = messages[locale] || messages.en;
    let str = dict[key] ?? messages.en[key] ?? key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(new RegExp(`{${k}}`, 'g'), String(v));
      });
    }
    return str;
  };

  const setLang = (l: Locale) => dispatch(setLocale(l));

  return { t, locale, setLocale: setLang };
}

