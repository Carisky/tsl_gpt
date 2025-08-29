"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ThemeToggle from "@/components/ThemeToggle";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export default function NavBar() {
  const isAuthed = useSelector((s: RootState) => Boolean(s.auth.token));
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          TSL GPT
        </Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button color="inherit" href="/">Home</Button>
          {!isAuthed ? (
            <>
              <Button color="inherit" href="/login">Login</Button>
              <Button color="inherit" href="/register">Register</Button>
            </>
          ) : (
            <Button color="inherit" href="/dashboard">Dashboard</Button>
          )}
          <ThemeToggle />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

