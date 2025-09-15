"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import type { AppDispatch } from "@/store/store";
import type { AuthResponse, LoginRequest } from "@/types/auth";
import { Box, Paper, TextField, Button, Stack, Typography, Link, Checkbox, FormControlLabel } from "@mui/material";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/useI18n";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { t } = useI18n();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      const payload: LoginRequest = { email, password };
      const data = await apiFetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      dispatch(setCredentials({ user: data.user, token: data.token }));
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 64px)', p: 2 }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 1000 }}>
        <Paper sx={{ p: 0, display: 'flex', overflow: 'hidden', borderRadius: 3 }} elevation={6}>
          <Box sx={(theme) => ({
            display: { xs: 'none', md: 'flex' },
            flex: 1,
            background: 'radial-gradient(1200px 500px at -10% -10%, rgba(124,77,255,0.35), transparent), radial-gradient(800px 400px at 120% 120%, rgba(64,196,255,0.35), transparent), linear-gradient(135deg, #0f0f10, #151517)',
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            p: 4,
            color: theme.palette.mode === 'dark' ? '#fff' : '#fff',
          })}>
            <Box sx={{ border: '1px solid rgba(255,255,255,0.25)', borderRadius: 4, p: 3, maxWidth: 360 }}>
              <Typography variant="overline" sx={{ opacity: 0.8 }}>A WISE QUOTE</Typography>
              <Typography variant="h4" sx={{ mt: 1, mb: 1, fontWeight: 600 }}>Get Everything You Want</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>You can get everything you want if you work hard, trust the process, and stick to the plan.</Typography>
            </Box>
          </Box>
          <Box sx={{ flex: 1, p: { xs: 3, md: 5 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box component="form" onSubmit={onSubmit} sx={{ width: '100%', maxWidth: 420 }}>
              <Stack spacing={2}>
                <Typography variant="h5" fontWeight={600}>{t('auth.login.title')}</Typography>
                <TextField label={t('auth.email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth variant="filled" />
                <TextField label={t('auth.password')} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth variant="filled" />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <FormControlLabel control={<Checkbox size="small" />} label="Remember me" />
                  <Link href="#" underline="hover" sx={{ fontSize: 14 }}>{t('auth.forgot')}</Link>
                </Stack>
                {error && <Typography color="error" variant="body2">{error}</Typography>}
                <Button variant="contained" type="submit" size="large">{t('auth.signin')}</Button>
                <Typography variant="body2">
                  {t('auth.no_account')} <Link href="/register">{t('auth.signup')}</Link>
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}
