"use client";

import { API_URL, apiFetch } from "@/lib/api";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, setUser } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import type { AppDispatch } from "@/store/store";
import type { MeResponse } from "@/types/auth";
import { Container, Paper, Typography, Button, Stack } from "@mui/material";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { token, user } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    (async () => {
      try {
        const data = await apiFetch<MeResponse>("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(setUser(data.user));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load user";
        setError(message);
      }
    })();
  }, [token, dispatch, router]);

  const onLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  if (!token) return null;

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Paper sx={{ p: 4 }} elevation={4}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Dashboard
          </Typography>
          {error && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          {user ? (
            <Stack spacing={2}>
              <Typography>
                Signed in as <strong>{user.email}</strong>
                {user.name ? ` (${user.name})` : ""}
              </Typography>
              <Button variant="outlined" onClick={onLogout} sx={{ alignSelf: "flex-start" }}>
                Logout
              </Button>
            </Stack>
          ) : (
            <Typography>Loading user…</Typography>
          )}
          <Typography variant="caption" sx={{ mt: 3, display: "block" }}>
            API base: {API_URL}
          </Typography>
        </Paper>
      </motion.div>
    </Container>
  );
}
