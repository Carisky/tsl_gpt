"use client";

import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Link from "next/link";
import { useI18n } from "@/i18n/useI18n";

export default function Home() {
  const token = useSelector((s: RootState) => s.auth.token);
  const { t } = useI18n();
  return (
    <Box sx={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
      background: 'radial-gradient(1200px 500px at -10% -10%, rgba(124,77,255,0.25), transparent), radial-gradient(800px 400px at 120% 120%, rgba(64,196,255,0.25), transparent)'
    }}>
      <Container maxWidth="lg">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={6} alignItems="center" justifyContent="space-between">
          <Box sx={{ flex: 1 }}>
            <Typography variant="overline" sx={{ opacity: 0.7 }}>TSL GPT</Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, letterSpacing: -0.5 }}>
              Secure AI chat for your team
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
              Corporate layer over OpenAI: access control, model governance, and data redaction out of the box.
            </Typography>
            <Stack direction="row" spacing={2}>
              {token ? (
                <Button component={Link} href="/dashboard" variant="contained" size="large">{t('nav.dashboard')}</Button>
              ) : (
                <>
                  <Button component={Link} href="/login" variant="contained" size="large">{t('nav.login')}</Button>
                  <Button component={Link} href="/register" variant="outlined" size="large">{t('nav.register')}</Button>
                </>
              )}
            </Stack>
          </Box>
          <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }}>
            <Box sx={{
              height: 320,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #7C4DFF, #40C4FF)',
              filter: 'blur(8px)',
              opacity: 0.8,
            }} />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

