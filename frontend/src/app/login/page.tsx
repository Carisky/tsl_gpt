"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import type { AppDispatch } from "@/store/store";
import type { AuthResponse, LoginRequest } from "@/types/auth";
import { Container, Paper, TextField, Button, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

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
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Paper sx={{ p: 4 }} elevation={4}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Login
          </Typography>
          <form onSubmit={onSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}
              <Button variant="contained" type="submit">
                Sign In
              </Button>
              <Typography variant="body2">
                No account? <a href="/register">Register</a>
              </Typography>
            </Stack>
          </form>
        </Paper>
      </motion.div>
    </Container>
  );
}
