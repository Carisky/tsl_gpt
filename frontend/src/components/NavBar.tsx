"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { useI18n } from "@/i18n/useI18n";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export default function NavBar() {
  const isAuthed = useSelector((s: RootState) => Boolean(s.auth.token));
  const { t } = useI18n();
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          TSL GPT
        </Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button color="inherit" href="/">{t('nav.home')}</Button>
          {!isAuthed ? (
            <>
              <Button color="inherit" href="/login">{t('nav.login')}</Button>
              <Button color="inherit" href="/register">{t('nav.register')}</Button>
            </>
          ) : (
            <Button color="inherit" href="/dashboard">{t('nav.dashboard')}</Button>
          )}
          <LanguageToggle />
          <ThemeToggle />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
