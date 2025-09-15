"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import type { AppDispatch } from "@/store/store";
import type { AuthResponse, RegisterRequest } from "@/types/auth";
import { Box, Paper, TextField, Button, Stack, Typography, Link } from "@mui/material";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/useI18n";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { t } = useI18n();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      const payload: RegisterRequest = { email, password, name };
      const data = await apiFetch<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      dispatch(setCredentials({ user: data.user, token: data.token }));
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
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
              <Typography variant="h4" sx={{ mt: 1, mb: 1, fontWeight: 600 }}>Build Things That Matter</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Join the platform, iterate fast, and deliver value to your team.</Typography>
            </Box>
          </Box>
          <Box sx={{ flex: 1, p: { xs: 3, md: 5 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box component="form" onSubmit={onSubmit} sx={{ width: '100%', maxWidth: 420 }}>
              <Stack spacing={2}>
                <Typography variant="h5" fontWeight={600}>{t('auth.register.title')}</Typography>
                <TextField label={t('auth.name')} type="text" value={name} onChange={(e) => setName(e.target.value)} fullWidth variant="filled" />
                <TextField label={t('auth.email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth variant="filled" />
                <TextField label={t('auth.password')} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth variant="filled" />
                {error && <Typography color="error" variant="body2">{error}</Typography>}
                <Button variant="contained" type="submit" size="large">{t('auth.signup')}</Button>
                <Typography variant="body2">
                  {t('auth.have_account')} <Link href="/login">{t('auth.signin')}</Link>
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}
