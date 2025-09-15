"use client";

import { IconButton, Tooltip } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useDispatch, useSelector } from "react-redux";
import { toggleMode } from "@/features/ui/themeSlice";
import type { RootState, AppDispatch } from "@/store/store";
import { useI18n } from "@/i18n/useI18n";

export default function ThemeToggle() {
  const mode = useSelector((s: RootState) => s.ui.mode);
  const dispatch = useDispatch<AppDispatch>();
  const next = mode === "light" ? "dark" : "light";
  const { t } = useI18n();
  return (
    <Tooltip title={t('theme.switch_to', { mode: t(`theme.mode.${next}`) })}>
      <IconButton color="inherit" onClick={() => dispatch(toggleMode())} aria-label="toggle theme">
        {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Tooltip>
  );
}
