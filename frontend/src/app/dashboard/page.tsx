"use client";

import { API_URL, apiFetch } from "@/lib/api";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, setCredentials, setUser } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import type { AppDispatch } from "@/store/store";
import type { MeResponse } from "@/types/auth";

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
    <div style={{ maxWidth: 720, margin: "40px auto" }}>
      <h1>Dashboard</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {user ? (
        <div>
          <p>
            Signed in as <strong>{user.email}</strong>
            {user.name ? ` (${user.name})` : ""}
          </p>
          <button onClick={onLogout}>Logout</button>
        </div>
      ) : (
        <p>Loading user…</p>
      )}
      <div style={{ marginTop: 24 }}>
        <p>API base: {API_URL}</p>
      </div>
    </div>
  );
}
