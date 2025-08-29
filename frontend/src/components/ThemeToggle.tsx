"use client";

import { IconButton, Tooltip } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useDispatch, useSelector } from "react-redux";
import { toggleMode } from "@/features/ui/themeSlice";
import type { RootState, AppDispatch } from "@/store/store";

export default function ThemeToggle() {
  const mode = useSelector((s: RootState) => s.ui.mode);
  const dispatch = useDispatch<AppDispatch>();
  const next = mode === "light" ? "dark" : "light";
  return (
    <Tooltip title={`Switch to ${next} mode`}>
      <IconButton color="inherit" onClick={() => dispatch(toggleMode())} aria-label="toggle theme">
        {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Tooltip>
  );
}

