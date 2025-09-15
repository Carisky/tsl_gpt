"use client";

import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import TranslateIcon from "@mui/icons-material/Translate";
import { useState } from "react";
import { useI18n } from "@/i18n/useI18n";

export default function LanguageToggle() {
  const { locale, setLocale, t } = useI18n();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  return (
    <>
      <Tooltip title={"Language"}>
        <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)} aria-label="change language">
          <TranslateIcon />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <MenuItem selected={locale === 'en'} onClick={() => { setLocale('en'); setAnchorEl(null); }}>English</MenuItem>
        <MenuItem selected={locale === 'ru'} onClick={() => { setLocale('ru'); setAnchorEl(null); }}>Русский</MenuItem>
        <MenuItem selected={locale === 'pl'} onClick={() => { setLocale('pl'); setAnchorEl(null); }}>Polski</MenuItem>
      </Menu>
    </>
  );
}

